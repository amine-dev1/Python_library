import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";

export default function UserLayout() {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#0f1115", color: "#fff" }}>
            <UserSidebar />
            <main style={{ flex: 1, marginLeft: "250px", padding: "32px", overflowY: "auto" }}>
                <Outlet />
            </main>
        </div>
    );
}
