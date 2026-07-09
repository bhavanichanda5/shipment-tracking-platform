import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

import { useEffect, useState } from "react";
import { getMonthlyShipmentOverview, getShipmentStatusCounts } from "../services/analyticsService";
import "../styles/AnalyticsSection.css";

const COLORS=[
    "#22C55E",
    "#2563EB",
    "#F59E0B",
    "#EF4444"
];

function AnalyticsSection(){
    const [monthlyData, setMonthlyData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        fetchAnalytics();

        const refreshCharts = () => {
            fetchAnalytics();
        };

        window.addEventListener("analytics:update", refreshCharts);

        return () => {
            window.removeEventListener("analytics:update", refreshCharts);
        };
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [monthlyOverview, statusCounts] = await Promise.all([
                getMonthlyShipmentOverview(),
                getShipmentStatusCounts()
            ]);

            setMonthlyData(monthlyOverview.map(entry => ({
                month: entry.month,
                shipments: entry.shipments
            })));

            setStatusData(statusCounts.map(entry => ({
                name: entry.status.replace("_", " "),
                value: entry.count
            })));
        } catch (error) {
            console.error("Failed to load analytics", error);
        }
    };

    return(

        <div className="analytics-grid">

            <div className="chart-card">

                <h3>Shipment Overview</h3>

                <ResponsiveContainer width="100%" height={300}>

                    <LineChart data={monthlyData}>

                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis dataKey="month"/>

                        <YAxis/>

                        <Tooltip/>

                        <Line
                            type="monotone"
                            dataKey="shipments"
                            stroke="#2563EB"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

            <div className="chart-card">

                <h3>Shipment Status</h3>

                <ResponsiveContainer width="100%" height={300}>

                    <PieChart>

                        <Pie

                            data={statusData}

                            dataKey="value"

                            outerRadius={100}

                            label

                        >

                            {

                                statusData.map((entry,index)=>

                                    <Cell
                                        key={index}
                                        fill={COLORS[index]}
                                    />

                                )

                            }

                        </Pie>

                        <Tooltip/>

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default AnalyticsSection;