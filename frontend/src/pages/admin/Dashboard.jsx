import { useAuth } from "../../auth/AuthContext";

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-lg">
                Welcome, <span className="font-semibold text-purple-600">{user?.username || "Admin"}</span>!
            </p>
            <p className="mt-2 text-gray-600">Overview of system statistics.</p>
        </div>
    );
}
