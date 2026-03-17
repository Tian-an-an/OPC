import React from "react";
import { BackLayout } from "../components/BackLayout";
import { useAppContext } from "../context/AppContext";
import { 
  TrendingUp, 
  ShoppingCart, 
  Users
} from "lucide-react";

export function BackDashboard() {
  const { orders } = useAppContext();

  const today = new Date().toISOString().slice(0, 10);
  const todayNormalOrders = orders.filter(o => o.time.startsWith(today) && o.status === "正常");
  const todayRevenue = todayNormalOrders.reduce((sum, o) => sum + o.finalTotal, 0);
  const todayOrders = todayNormalOrders.length;
  const avgOrderValue = todayOrders > 0 ? (todayRevenue / todayOrders).toFixed(2) : "0.00";

  return (
    <BackLayout title="首页看板">
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-gray-100 flex flex-col items-center text-center">
             <div className="h-14 w-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={28} />
             </div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">今日营业额</p>
             <h2 className="text-4xl font-black text-gray-800 mt-2 tracking-tighter">¥{todayRevenue.toFixed(2)}</h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-gray-100 flex flex-col items-center text-center">
             <div className="h-14 w-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingCart size={28} />
             </div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">今日订单笔数</p>
             <h2 className="text-4xl font-black text-gray-800 mt-2 tracking-tighter">{todayOrders} <span className="text-xl">单</span></h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-gray-100 flex flex-col items-center text-center">
             <div className="h-14 w-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
                <Users size={28} />
             </div>
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">今日客单价</p>
             <h2 className="text-4xl font-black text-gray-800 mt-2 tracking-tighter">¥{avgOrderValue}</h2>
          </div>
        </div>

      </div>
    </BackLayout>
  );
}
