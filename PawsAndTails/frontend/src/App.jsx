import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshCartFromStorage } from "./features/cartSlice";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Adoption from "./pages/adoption";
import MarketPlace from "./pages/Marketplace";
import Grooming from "./pages/Grooming";
import Veterinary from "./pages/Veterinary";
import Products from "./pages/Products";
import AIBreedDetection from "./pages/AIBreedDetection";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "./Layout/DashboardLayout";
import DashboardNotFound from "./pages/DashboardNotFound";
import NotFound from "./pages/NotFound";
import PetAdoptions from "./pages/PetAdoptions";
import Veterinaries from "./pages/Veterinaries";
import PetGrooming from "./pages/PetGrooming";
import DashboardBlogs from "./pages/DashboardBlogs";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Appointments from "./pages/Appointments";
import SinglePost from "./pages/singlePost";
import RoleRoute from "./components/RoleRoute";
import DashboardUsers from "./pages/DashboardUsers";
import BreedDetection from "./pages/BreedDetection";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        dispatch(refreshCartFromStorage());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adoption" element={<Adoption />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/grooming" element={<Grooming />} />
        <Route path="/veterinary" element={<Veterinary />} />
        <Route path="/ai-breed-detection" element={<AIBreedDetection />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/single-post/:id" element={<SinglePost />} />
        <Route path="/breed-detector" element={<BreedDetection />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />

            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="petadoptions" element={<PetAdoptions />} />
              <Route path="veterinaries" element={<Veterinaries />} />
              <Route path="products" element={<Products />} />
              <Route path="petgrooming" element={<PetGrooming />} />
              <Route path="blogs" element={<DashboardBlogs />} />
              <Route path="users" element={<DashboardUsers />} />
            </Route>

            <Route path="unauthorized" element={<p>Access Denied</p>} />
            <Route path="*" element={<DashboardNotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
