import React, { useState } from "react";
import { BackLayout } from "../components/BackLayout";
import { useAppContext, Order } from "../context/AppContext";
import { Search, Calendar, Eye, FileText, ShoppingBag, ReceiptText, XCircle } from "lucide-react";

export function BackReports() {
  const { orders, setOrders } = useAppContext();
  const [activeTab, setActiveTab] = useState<"日报" | "月报">('日报');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // 过滤订单
  const filteredOrders = orders.filter(o => {
    // 订单号搜索
    const matchesOrderId = o.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 日期过滤
    let matchesDate = true;
    if (activeTab === '日报') {
      matchesDate = o.time.startsWith(selectedDate);
    } else if (activeTab === '月报') {
      matchesDate = o.time.startsWith(selectedMonth);
    }
    
    return matchesOrderId && matchesDate;
  });

  // 处理退单
  const handleRefund = (orderId: string) => {
    if (window.confirm('确定要退单吗？')) {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: "退单" as const }
            : order
        )
      );
    }
  };

  return (
    <BackLayout title="数据报表">
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Tabs & Search */}
        <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex bg-gray-100 p-1 rounded-2xl w-full md:w-auto self-start">
              {["日报", "月报"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 md:min-w-[120px] rounded-xl px-6 py-2.5 font-bold transition-all ${
                    activeTab === tab 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>

           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
              <div className="relative flex-1">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-12 pr-6 py-3 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                   placeholder="输入订单号查询..."
                 />
              </div>
              <div className="relative w-full sm:w-auto">
                {activeTab === '日报' && (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-12 px-4 pr-10 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                  />
                )}
                {activeTab === '月报' && (
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full h-12 px-4 pr-10 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                  />
                )}
              </div>
           </div>
        </div>

        {/* Data List */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest border-b">
                  <th className="px-4 sm:px-8 py-4">订单编号</th>
                  <th className="px-4 sm:px-8 py-4">订单金额</th>
                  <th className="px-4 sm:px-8 py-4">实收金额</th>
                  <th className="px-4 sm:px-8 py-4">订单状态</th>
                  <th className="px-4 sm:px-8 py-4">下单时间</th>
                  <th className="px-4 sm:px-8 py-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 sm:px-8 py-16 text-center text-gray-400 font-medium">
                       暂无匹配的订单记录
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/30 transition-all">
                      <td className="px-4 sm:px-8 py-4 font-bold text-gray-800 tracking-tight break-all">{order.id}</td>
                      <td className="px-4 sm:px-8 py-4 text-gray-500 font-medium">¥{order.total.toFixed(2)}</td>
                      <td className="px-4 sm:px-8 py-4 font-black text-indigo-600">¥{order.finalTotal.toFixed(2)}</td>
                      <td className="px-4 sm:px-8 py-4">
                         <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === "正常" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                         }`}>
                            {order.status}
                         </span>
                      </td>
                      <td className="px-4 sm:px-8 py-4 text-gray-400 text-sm break-all">{order.time}</td>
                      <td className="px-4 sm:px-8 py-4 text-center">
                         <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all w-full sm:w-auto"
                            >
                               <Eye size={14} />
                               查看
                            </button>
                            {order.status === "正常" && (
                              <button 
                                onClick={() => handleRefund(order.id)}
                                className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-all w-full sm:w-auto"
                              >
                                 <XCircle size={14} />
                                 退单
                              </button>
                            )}
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-[2.5rem] bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                     <ReceiptText size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-gray-800">订单详情</h3>
                     <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Order ID: {selectedOrder.id}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                           selectedOrder.status === "正常" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                           {selectedOrder.status}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-sm font-bold text-gray-400">下单日期</p>
                  <p className="font-bold text-gray-800">{selectedOrder.time}</p>
               </div>
            </div>

            <div className="space-y-1 mb-8">
               <div className="flex items-center bg-gray-50 p-4 rounded-t-2xl text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex-[3]">菜品明细</span>
                  <span className="flex-1 text-center">数量</span>
                  <span className="flex-1 text-right">小计</span>
               </div>
               <div className="max-h-[300px] overflow-y-auto border-x px-4 divide-y divide-gray-100">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="py-4 flex items-center">
                       <div className="flex-[3] pr-4">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.remark === '打包' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                              {item.remark || '堂食'}
                            </span>
                          </div>
                       </div>
                       <span className="flex-1 text-center font-bold text-gray-500">x{item.quantity}</span>
                       <span className="flex-1 text-right font-black text-gray-800">¥{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
               </div>
               <div className="bg-indigo-600 p-6 rounded-b-2xl text-white flex items-center justify-between">
                  <div>
                     <p className="text-xs opacity-60 font-bold uppercase">合计实收</p>
                     <p className="text-sm">优惠金额: ¥{selectedOrder.discount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                     <h4 className="text-3xl font-black italic">¥{selectedOrder.finalTotal.toFixed(2)}</h4>
                  </div>
               </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full rounded-2xl bg-gray-900 py-5 font-bold text-white hover:bg-black transition-all active:scale-95"
            >
              关 闭
            </button>
          </div>
        </div>
      )}
    </BackLayout>
  );
}
