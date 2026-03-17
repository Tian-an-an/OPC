import { createBrowserRouter } from "react-router";
import { FrontLogin } from "./pages/FrontLogin";
import { FrontMain } from "./pages/FrontMain";
import { Checkout } from "./pages/Checkout";
import { BackLogin } from "./pages/BackLogin";
import { BackDashboard } from "./pages/BackDashboard";
import { BackProducts } from "./pages/BackProducts";
import { BackReports } from "./pages/BackReports";
import { BackInventory } from "./pages/BackInventory";
import { BackSettings } from "./pages/BackSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FrontLogin,
  },
  {
    path: "/pos",
    Component: FrontMain,
  },
  {
    path: "/checkout",
    Component: Checkout,
  },
  {
    path: "/admin",
    Component: BackLogin,
  },
  {
    path: "/admin/dashboard",
    Component: BackDashboard,
  },
  {
    path: "/admin/products",
    Component: BackProducts,
  },
  {
    path: "/admin/reports",
    Component: BackReports,
  },
  {
    path: "/admin/inventory",
    Component: BackInventory,
  },
  {
    path: "/admin/settings",
    Component: BackSettings,
  },
]);
