import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import CustomerDashboard from "./pages/dashboard/customer/CustomerDashboard";
import BusinessDashboard from "./pages/dashboard/business_client/BusinessDashboard";
import LogisticsDashboard from "./pages/dashboard/logistics_operator/LogisticsDashboard";
import SupportDashboard from "./pages/dashboard/support_agent/SupportDashboard";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                // Added the dashboard routes here
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer"
                    element={
                        <ProtectedRoute>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/business_client"
                    element={
                        <ProtectedRoute>
                            <BusinessDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/logistics_operator"
                    element={
                        <ProtectedRoute>
                            <LogisticsDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/support_agent"
                    element={
                        <ProtectedRoute>
                            <SupportDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;