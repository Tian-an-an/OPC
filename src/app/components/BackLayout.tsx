import React from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  BarChart3, 
  PackageSearch, 
  Settings, 
  LogOut,
  ChevronRight,
  Monitor
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function BackLayout({ children, title }: { children: React.ReactNode, title: string }) {
  const { settings } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "首页看板", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "商品管理", icon: UtensilsCrossed, path: "/admin/products" },
    { name: "数据报表", icon: BarChart3, path: "/admin/reports" },
    { name: "库存管理", icon: PackageSearch, path: "/admin/inventory" },
    { name: "系统设置", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 truncate">
            <Monitor size={24} className="text-indigo-400" />
            后台管理端
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{settings.storeName}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-lg ${
                  isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon size={24} />
                <span>{item.name}</span>
                {isActive && <ChevronRight size={20} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
           <button 
             onClick={() => navigate("/pos")}
             className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-800 py-3 text-sm font-bold text-indigo-400 hover:bg-gray-700 transition-all"
           >
             <Monitor size={16} />
             切换至收银端
           </button>
           <button 
             onClick={() => navigate("/admin")}
             className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-900/20 py-3 text-sm font-bold text-red-500 hover:bg-red-900/40 transition-all"
           >
             <LogOut size={16} />
             退出登录
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white border-b flex items-center justify-between px-10 shrink-0 shadow-sm">
           <h1 className="text-3xl font-black text-gray-800">{title}</h1>
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-lg font-bold text-gray-800">管理员</p>
                 <p className="text-sm text-gray-400">最后登录: 今天</p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">
                 AD
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
