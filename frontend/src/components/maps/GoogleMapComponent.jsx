import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "12px"
};

// Bangalore (Default Center)
const center = {
    lat: 12.9716,
    lng: 77.5946
};

// Shipment Location
const shipmentLocation = {
    lat: 12.9716,
    lng: 77.5946
};

// Destination Location
const destinationLocation = {
    lat: 12.9352,
    lng: 77.6245
};

function GoogleMapComponent() {

    return (

        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        >

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
            >

                <Marker
                    position={shipmentLocation}
                    title="Shipment"
                />

                <Marker
                    position={destinationLocation}
                    title="Destination"
                />

            </GoogleMap>

        </LoadScript>

    );

}

export default GoogleMapComponent;