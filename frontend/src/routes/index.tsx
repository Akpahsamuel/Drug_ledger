import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminDashboard from "./admin/AdminDashboard";
import ManufacturerDashboard from "./manufacturer/ManufacturerDashboard";
import RegulatorDashboard from "./regulator/RegulatorDashboard";
import DistributorDashboard from "./distributor/DistributorDashboard";
import Home from "./Home";
import { AdminRoute, ManufacturerRoute, RegulatorRoute, DistributorRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "manufacturer",
        element: (
          <ManufacturerRoute>
            <ManufacturerDashboard />
          </ManufacturerRoute>
        ),
      },
      {
        path: "regulator",
        element: (
          <RegulatorRoute>
            <RegulatorDashboard />
          </RegulatorRoute>
        ),
      },
      {
        path: "distributor",
        element: (
          <DistributorRoute>
            <DistributorDashboard />
          </DistributorRoute>
        ),
      },
    ],
  },
]); 