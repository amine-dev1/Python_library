import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
export default function AdminLayout() {
  return (
    
     
    

     <div style={{ display: "flex",  background: "#151538", color: "#fff" }}>
       <h2>Admin Dashboard</h2>          <UserSidebar />
                <main style={{ flex: 1, marginLeft: "100px", padding: "2px", overflowY: "auto" }}>
                    <Outlet />
                </main>
            </div>
  );
}
