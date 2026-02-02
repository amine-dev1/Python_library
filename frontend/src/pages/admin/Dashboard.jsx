import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getBooks } from "../../api/books.api";
import { getUsers } from "../../api/users.api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Users, BookOpen, BookMarked, TrendingUp } from "lucide-react";

// ─── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, iconBg, iconColor, trend }) {
  return (
    <div className="bg-[#1a1b41] rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-[#2a2b51] hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="bg-white/10 p-2 rounded-xl">
          <Icon size={16} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className="text-xs font-semibold text-white bg-white/10 px-2.5 py-0.5 rounded-full">
            +{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-extrabold text-white leading-none">{value}</p>
        <p className="text-xs text-gray-300 mt-1.5 font-medium tracking-wide uppercase">{title}</p>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-sm text-gray-600">{entry.name}</span>
            <span className="text-sm font-bold text-gray-800 ml-auto">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, booksRes] = await Promise.all([getUsers(), getBooks()]);
        const users = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];
        const books = Array.isArray(booksRes) ? booksRes : booksRes?.data || [];
        const loaned = books.filter((b) => b.available === false || b.borrowedBy || b.loanId);

        setTotalUsers(users.length);
        setTotalBooks(books.length);
        setTotalLoans(loaned.length);

        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
        const monthlyBooks = new Array(12).fill(0);
        const monthlyLoans = new Array(12).fill(0);

        books.forEach((book) => {
          const dateStr = book.createdAt || book.created_at;
          if (dateStr) {
            const m = new Date(dateStr).getMonth();
            monthlyBooks[m]++;
            if (book.available === false || book.borrowedBy || book.loanId) monthlyLoans[m]++;
          }
        });

        const hasData = monthlyBooks.some((v) => v > 0);
        if (!hasData && books.length > 0) {
          const per = Math.floor(books.length / 12);
          const rem = books.length % 12;
          monthlyBooks.forEach((_, i) => (monthlyBooks[i] = per + (i < rem ? 1 : 0)));
          const lPer = Math.floor(loaned.length / 12);
          const lRem = loaned.length % 12;
          monthlyLoans.forEach((_, i) => (monthlyLoans[i] = lPer + (i < lRem ? 1 : 0)));
        }

        setChartData(months.map((m, i) => ({ month: m, Livres: monthlyBooks[i], Emprunts: monthlyLoans[i] })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6 pt-10">
        <div className="w-full max-w-5xl">
          <div className="h-7 bg-gray-200 rounded w-44 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-56 mb-8 animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-[#1a1b41] rounded-2xl border border-[#2a2b51] p-5 animate-pulse">
                <div className="h-10 bg-white/10 rounded-xl w-10 mb-4" />
                <div className="h-8 bg-white/20 rounded w-14 mb-2" />
                <div className="h-3 bg-white/10 rounded w-20" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-36 mb-6" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const loanRate = totalBooks > 0 ? ((totalLoans / totalBooks) * 100).toFixed(1) : 0;
  const booksPerUser = totalUsers > 0 ? (totalBooks / totalUsers).toFixed(1) : 0;
  const loansPerUser = totalUsers > 0 ? (totalLoans / totalUsers).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6 pt-8">
      <div className="w-full max-w-5xl">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-7 gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Bienvenue,{" "}
              <span className="font-bold text-indigo-600">{user?.username || "ADMIN"}</span>
              {" "}— Aperçu des statistiques du système.
            </p>
          </div>
          <div className="text-right bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm self-start sm:self-auto">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Mis à jour</p>
            <p className="text-sm font-semibold text-gray-700">
              {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* ── 4 Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Utilisateurs totaux"
            value={totalUsers}
            icon={Users}
            trend={12}
          />
          <StatCard
            title="Livres totaux"
            value={totalBooks}
            icon={BookOpen}
            trend={8}
          />
          <StatCard
            title="Emprunts actifs"
            value={totalLoans}
            icon={BookMarked}
            trend={5}
          />
          <StatCard
            title="Livres disponibles"
            value={totalBooks - totalLoans}
            icon={TrendingUp}
          />
        </div>

        {/* ── Chart ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-2">
            <div>
              <h2 className="text-base font-bold text-gray-800">Statistiques mensuelles</h2>
              <p className="text-xs text-gray-400 mt-0.5">Livres ajoutés vs Emprunts par mois</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                <span className="text-xs text-gray-500 font-medium">Livres</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="text-xs text-gray-500 font-medium">Emprunts</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barGap={3} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc", rx: 6 }} />
              <Bar dataKey="Livres" radius={[5, 5, 0, 0]} barSize={18}>
                {chartData.map((_, i) => <Cell key={i} fill="#1a1b41" />)}
              </Bar>
              <Bar dataKey="Emprunts" radius={[5, 5, 0, 0]} barSize={18}>
                {chartData.map((_, i) => <Cell key={i} fill="#f59e0b" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── KPI Summary Bar ── */}
        <div className="bg-[#1a1b41] rounded-2xl p-5 shadow-md border border-[#2a2b51]">
          <div className="grid grid-cols-3 gap-4 divide-x divide-white/20">
            <div className="text-center">
              <p className="text-xs text-gray-300 font-medium uppercase tracking-wide mb-1">Taux d'emprunt</p>
              <p className="text-2xl font-extrabold text-white">{loanRate}<span className="text-sm font-normal text-gray-400">%</span></p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-300 font-medium uppercase tracking-wide mb-1">Livres / utilisateur</p>
              <p className="text-2xl font-extrabold text-white">{booksPerUser}<span className="text-sm font-normal text-gray-400"> moy.</span></p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-300 font-medium uppercase tracking-wide mb-1">Emprunts / utilisateur</p>
              <p className="text-2xl font-extrabold text-white">{loansPerUser}<span className="text-sm font-normal text-gray-400"> moy.</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}