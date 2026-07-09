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

import "../styles/AnalyticsSection.css";

const monthlyData = [

    { month:"Jan", shipments:120 },
    { month:"Feb", shipments:180 },
    { month:"Mar", shipments:240 },
    { month:"Apr", shipments:310 },
    { month:"May", shipments:390 },
    { month:"Jun", shipments:470 }

];

const statusData=[

    {name:"Delivered",value:65},
    {name:"Transit",value:20},
    {name:"Pending",value:10},
    {name:"Cancelled",value:5}

];

const COLORS=[
    "#22C55E",
    "#2563EB",
    "#F59E0B",
    "#EF4444"
];

function AnalyticsSection(){

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