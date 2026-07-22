import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader
} from "@react-google-maps/api";

import { getAllShipments } from "../../services/shipmentService";
import "../../styles/Tracking.css";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const defaultCenter = { lat: 20.5937, lng: 78.9629 };

const directionsCache = new Map();

// --- Sub-component for individual Map & Live Metrics ---
const ShipmentMap = React.memo(({ shipment, isLoaded, onMetricsCalculated }) => {
  const [directions, setDirections] = useState(null);
  const [truckPos, setTruckPos] = useState(null);
  const mapRef = useRef(null);
  const animRef = useRef(null);

  const routeKey = `${shipment.origin}->${shipment.destination}`;

  // Fetch Directions & Calculate Real Distance/ETA
  useEffect(() => {
    if (!isLoaded || !shipment.origin || !shipment.destination || !window.google) return;

    if (directionsCache.has(routeKey)) {
      const cached = directionsCache.get(routeKey);
      setDirections(cached);
      extractMetrics(cached);
      return;
    }

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: shipment.origin,
        destination: shipment.destination,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          directionsCache.set(routeKey, result);
          setDirections(result);
          extractMetrics(result);
        } else {
          console.warn(`Route request failed for ${shipment.trackingId}: ${status}`);
        }
      }
    );
  }, [isLoaded, shipment.origin, shipment.destination, routeKey, shipment.trackingId]);

  // Extract Route Distance & Dynamic ETA
  const extractMetrics = (result) => {
    if (!result?.routes?.[0]?.legs?.[0]) return;
    const leg = result.routes[0].legs[0];
    
    const totalDistanceKm = (leg.distance.value / 1000).toFixed(1);
    const durationMinutes = Math.round(leg.duration.value / 60);

    // Calculate dynamic estimated arrival time
    const etaDate = new Date();
    etaDate.setMinutes(etaDate.getMinutes() + durationMinutes);

    if (onMetricsCalculated) {
      onMetricsCalculated(shipment.trackingId, {
        distanceKm: totalDistanceKm,
        durationMinutes,
        etaText: leg.duration.text,
        estimatedArrival: etaDate.toLocaleString()
      });
    }
  };

  // Handle Map Bounds Fit
  useEffect(() => {
    if (!mapRef.current || !directions) return;
    const bounds = new window.google.maps.LatLngBounds();
    directions.routes[0].overview_path.forEach((point) => bounds.extend(point));
    mapRef.current.fitBounds(bounds);
  }, [directions]);

  // Animate Truck Marker
  useEffect(() => {
    if (!directions) return;

    const path = directions.routes[0].overview_path;
    if (!path || path.length === 0) return;

    if (animRef.current) clearInterval(animRef.current);

    let idx = 0;
    animRef.current = setInterval(() => {
      if (idx >= path.length) {
        clearInterval(animRef.current);
        return;
      }
      setTruckPos({ lat: path[idx].lat(), lng: path[idx].lng() });
      idx++;
    }, 400);

    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [directions]);

  return (
    <div className="tracking-map">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "420px", borderRadius: "10px" }}
        center={truckPos || defaultCenter}
        zoom={5}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#2563eb",
                strokeWeight: 5
              }
            }}
          />
        )}
        {truckPos && <Marker position={truckPos} title="Delivery Truck" />}
      </GoogleMap>
    </div>
  );
});

// --- Delay Prediction Engine ---
const calculateDelayPrediction = (shipment, metrics) => {
  const statusUpper = String(shipment.status || "").toUpperCase();
  if (statusUpper === "CANCELLED" || statusUpper === "DELIVERED") {
    return { risk: "NONE", label: "N/A", confidence: "100%", delayReason: "No delay risk." };
  }

  const scheduledDate = new Date(shipment.deliveryDate);
  const now = new Date();

  // If scheduled delivery date has passed but status is not DELIVERED -> HIGH DELAY RISK
  if (now > scheduledDate) {
    return {
      risk: "HIGH",
      label: "High Delay Risk",
      confidence: "92%",
      delayReason: "Schedule Exceeded: Shipment past target delivery date."
    };
  }

  // Check remaining hours against live route distance/time
  if (metrics?.durationMinutes) {
    const hoursRemainingInSchedule = (scheduledDate - now) / (1000 * 60 * 60);
    const hoursNeeded = metrics.durationMinutes / 60;

    if (hoursNeeded > hoursRemainingInSchedule) {
      return {
        risk: "HIGH",
        label: "High Delay Risk",
        confidence: "88%",
        delayReason: "Transit Bottleneck: Traffic or route distance exceeds time remaining."
      };
    } else if (hoursNeeded > hoursRemainingInSchedule * 0.75) {
      return {
        risk: "MEDIUM",
        label: "Moderate Delay Risk",
        confidence: "75%",
        delayReason: "Tight Timeline: Minor disruptions may impact delivery."
      };
    }
  }

  return {
    risk: "LOW",
    label: "On Schedule",
    confidence: "95%",
    delayReason: "Smooth Transit: Operating within standard timeline."
  };
};

// --- Timeline Helper ---
const getShipmentTimeline = (shipment) => {
  const statusUpper = String(shipment.status || "").toUpperCase();

  if (statusUpper === "CANCELLED") {
    return [
      {
        title: "Order Placed",
        location: shipment.origin,
        time: shipment.shipmentDate,
        state: "completed"
      },
      {
        title: "Shipment Cancelled",
        location: "System / Customer Request",
        time: shipment.deliveryDate || "Terminated",
        state: "cancelled"
      }
    ];
  }

  return [
    {
      title: "Order Confirmed",
      location: shipment.origin,
      time: shipment.shipmentDate,
      state: "completed"
    },
    {
      title: "Picked Up",
      location: `${shipment.origin} Warehouse`,
      time: shipment.shipmentDate,
      state: statusUpper === "PENDING" ? "active" : "completed"
    },
    {
      title: "Current Location",
      location: statusUpper === "DELIVERED" ? shipment.destination : shipment.origin,
      time: "Live",
      state:
        statusUpper === "IN_TRANSIT"
          ? "active"
          : statusUpper === "PENDING"
          ? "upcoming"
          : "completed"
    },
    {
      title: "Destination Hub",
      location: shipment.destination,
      time: "",
      state:
        statusUpper === "OUT_FOR_DELIVERY" || statusUpper === "DELIVERED"
          ? "completed"
          : "upcoming"
    },
    {
      title: "Out For Delivery",
      location: shipment.destination,
      time: "",
      state:
        statusUpper === "OUT_FOR_DELIVERY"
          ? "active"
          : statusUpper === "DELIVERED"
          ? "completed"
          : "upcoming"
    },
    {
      title: "Delivered",
      location: shipment.destination,
      time: shipment.deliveryDate,
      state: statusUpper === "DELIVERED" ? "completed" : "upcoming"
    }
  ];
};

// --- Main Component ---
function Tracking() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const [shipments, setShipments] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleMetricsCalculated = useCallback((trackingId, metrics) => {
    setLiveMetrics((prev) => ({ ...prev, [trackingId]: metrics }));
  }, []);

  const loadShipments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllShipments();
      setShipments(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Unable to load shipment data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShipments();
    const interval = setInterval(loadShipments, 15000);
    return () => clearInterval(interval);
  }, [loadShipments]);

  const filteredShipments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return shipments
      .filter((shipment) => {
        const matchesSearch =
          keyword === "" ||
          shipment.trackingId?.toLowerCase().includes(keyword) ||
          shipment.customerName?.toLowerCase().includes(keyword) ||
          shipment.origin?.toLowerCase().includes(keyword) ||
          shipment.destination?.toLowerCase().includes(keyword);

        if (!matchesSearch) return false;
        if (!shipment.shipmentDate) return true;

        const shipmentDate = new Date(shipment.shipmentDate);
        if (fromDate && shipmentDate < new Date(fromDate)) return false;

        if (toDate) {
          const to = new Date(toDate);
          to.setHours(23, 59, 59, 999);
          if (shipmentDate > to) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.shipmentDate) - new Date(a.shipmentDate));
  }, [shipments, searchTerm, fromDate, toDate]);

  if (!isLoaded) {
    return <div className="tracking-loading-screen">Loading Google Maps & ETA Models...</div>;
  }

  return (
    <div className="tracking-view">
      <div className="tracking-header">
        <div>
          <h1>Live Delivery Monitoring & ETA Insights</h1>
          <p>Real-time logistics monitoring, automated ETA calculations, and delay forecasts.</p>
        </div>
        <div className="tracking-meta">
          <span className="meta-label">Auto Refresh:</span>
          <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : "--"}</span>
        </div>
      </div>

      <div className="tracking-search-panel">
        <input
          type="text"
          placeholder="Search Tracking ID / Customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="tracking-date-controls">
          <label>
            From
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label>
            To
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
        </div>
        <button onClick={loadShipments} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="tracking-error">{error}</div>}

      <div className="tracking-summary">
        <div>
          <strong>{filteredShipments.length}</strong>
          <span>Active Tracked Shipments</span>
        </div>
        <div>
          <strong>
            {
              filteredShipments.filter((s) => {
                const pred = calculateDelayPrediction(s, liveMetrics[s.trackingId]);
                return pred.risk === "HIGH";
              }).length
            }
          </strong>
          <span>High Delay Risk Alerts</span>
        </div>
      </div>

      <div className="tracking-list">
        {filteredShipments.map((shipment) => {
          const isCancelled = String(shipment.status || "").toUpperCase() === "CANCELLED";
          const metrics = liveMetrics[shipment.trackingId];
          const delayPrediction = calculateDelayPrediction(shipment, metrics);

          return (
            <div className="tracking-card" key={shipment.id || shipment.trackingId}>
              <div className="tracking-card-header">
                <div>
                  <h2>{shipment.trackingId}</h2>
                  <span>Customer: {shipment.customerName}</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {!isCancelled && (
                    <span className={`risk-pill risk-${delayPrediction.risk.toLowerCase()}`}>
                      {delayPrediction.label} ({delayPrediction.confidence})
                    </span>
                  )}
                  <div
                    className={`status-pill ${String(shipment.status)
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {shipment.status}
                  </div>
                </div>
              </div>

              <div className="tracking-card-body">
                <div>
                  <label>Origin</label>
                  <p>{shipment.origin}</p>
                </div>
                <div>
                  <label>Destination</label>
                  <p>{shipment.destination}</p>
                </div>
                <div>
                  <label>Distance / Time</label>
                  <p>{metrics ? `${metrics.distanceKm} km (${metrics.etaText})` : "Calculating..."}</p>
                </div>
                <div>
                  <label>Calculated Dynamic ETA</label>
                  <p>{isCancelled ? "Cancelled" : metrics?.estimatedArrival || shipment.deliveryDate}</p>
                </div>
              </div>

              {/* Delay Warning Banner */}
              {delayPrediction.risk === "HIGH" && !isCancelled && (
                <div className="delay-warning-box">
                  <strong>⚠️ Delay Alert:</strong> {delayPrediction.delayReason}
                </div>
              )}

              <div className="tracking-live-section">
                {isCancelled ? (
                  <div className="tracking-map-disabled">
                    <div className="cancelled-icon">✕</div>
                    <h3>Tracking Terminated</h3>
                    <p>This shipment was cancelled. Live monitoring and ETA predictions are suspended.</p>
                  </div>
                ) : (
                  <ShipmentMap
                    shipment={shipment}
                    isLoaded={isLoaded}
                    onMetricsCalculated={handleMetricsCalculated}
                  />
                )}

                <div className="tracking-timeline">
                  {getShipmentTimeline(shipment).map((step, index) => (
                    <div key={index} className="timeline-item">
                      <div className={`timeline-dot ${step.state}`} />
                      <div className="timeline-content">
                        <h4>{step.title}</h4>
                        <p>{step.location}</p>
                        {step.time && <small>{step.time}</small>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tracking-card-footer">
                <div>Auto Monitoring: Active</div>
                <div>{isCancelled ? "Shipment Cancelled" : `ETA Status: ${delayPrediction.label}`}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tracking;