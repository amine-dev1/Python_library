import { Routes, Route } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import RequireAdmin from "../auth/RequireAdmin";

import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/public/Home";
import Catalog from "../pages/public/Catalog";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ForgotPassword from "../pages/public/ForgotPassword";
import BookDetails from "../pages/public/BookDetails";

import UserDashboard from "../pages/user/Dashboard";
import Books from "../pages/user/Books";
import MyLoans from "../pages/user/MyLoans";
import Profile from "../pages/user/Profile";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminBooks from "../pages/admin/Books";
import AdminUsers from "../pages/admin/Users";
import AdminLoans from "../pages/admin/Loans";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Catalog />} />
            <Route path="/books/:id" element={<BookDetails />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<RequireAuth />}>
                <Route path="/user" element={<UserLayout />}>
                    <Route index element={<UserDashboard />} />
                    <Route path="books" element={<Books />} />
                    <Route path="loans" element={<MyLoans />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="books" element={<AdminBooks />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="loans" element={<AdminLoans />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}
