import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { useAppContext, OrderItem } from "../context/AppContext";
import { toast } from "sonner";
import { ShoppingCart, LogOut, Clock, CreditCard, Utensils, Package, Minus, Plus, Trash2 } from "lucide-react";

export function FrontMain() {
  const { 
    products, 
    settings, 
    currentOrder, 
    setCurrentOrder
  } = useAppContext();
  const [time, setTime] = useState(new Date());
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const availableProducts = products.filter(p => p.status === "on");

  const addToOrder = (product: any) => {
    setCurrentOrder(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.price,
        remark: "堂食"
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCurrentOrder(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      
      const newQty = item.quantity + delta;
      
      if (newQty <= 0) {
        return prev.filter(i => i.id !== id);
      }
      
      return prev.map(i => 
        i.id === id ? { ...i, quantity: newQty } : i
      );
    });
  };

  const removeItem = (id: string) => {
    setCurrentOrder(prev => prev.filter(i => i.id !== id));
  };

  const updateItemRemark = (id: string, remark: string) => {
    setCurrentOrder(prev => prev.map(item => 
      item.id === id ? { ...item, remark } : item
    ));
    setEditingItem(null);
  };

  const totalPrice = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (currentOrder.length === 0) {
      toast.error("订单中还没有商品");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 overflow-hidden select-none">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white">
            <ShoppingCart size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">{settings.cashierTitle}</h1>
        </div>
        
        <div className="text-2xl font-black text-purple-600 tracking-wider">
           {settings.cashierTitle.split("").join(" ")}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={18} />
            <span className="text-sm font-medium">
              {format(time, "yyyy-MM-dd HH:mm:ss")}
            </span>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">退出</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left: Product List (60%) */}
        <div className="flex flex-[60] flex-col overflow-hidden border-r bg-white">
          {/* Product List Header */}
          <div className="flex items-center bg-purple-50 border-b-2 border-purple-200 px-6 py-4">
            <div className="flex-1">
              <span className="text-base font-bold text-gray-700">商品名称</span>
            </div>
            <div className="w-28">
              <span className="text-base font-bold text-gray-700">单价</span>
            </div>
            <div className="w-36">
              <span className="text-base font-bold text-gray-700">数量</span>
            </div>
            <div className="w-20 flex justify-center">
              <span className="text-base font-bold text-gray-700">操作</span>
            </div>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {availableProducts.map((product, index) => {
                const orderItem = currentOrder.find(item => item.productId === product.id);
                const quantity = orderItem?.quantity || 0;
                
                return (
                  <div 
                    key={product.id} 
                    className={`flex items-center px-6 py-4 transition-colors ${
                      index % 2 === 1 ? "bg-purple-50/30" : "bg-white"
                    }`}
                  >
                    {/* Product Name */}
                    <div className="flex-1">
                      <span className="text-base font-medium text-gray-800">{product.name}</span>
                    </div>
                    
                    {/* Price */}
                    <div className="w-28">
                      <span className="text-lg font-bold text-purple-600">¥{product.price.toFixed(2)}</span>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center gap-2 w-36">
                      <button 
                        onClick={() => quantity > 0 && updateQuantity(orderItem!.id, -1)}
                        disabled={quantity === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center text-lg font-medium text-gray-800">{quantity}</span>
                      <button 
                        onClick={() => {
                          if (quantity === 0) {
                            addToOrder(product);
                          } else {
                            updateQuantity(orderItem!.id, 1);
                          }
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {/* Add Button */}
                    <div className="w-20 flex justify-center">
                      <button 
                        onClick={() => addToOrder(product)}
                        className="flex h-9 px-4 items-center justify-center rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all active:scale-95"
                      >
                        添加
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary (40%) */}
        <div className="flex flex-[40] flex-col bg-white">
          <div className="flex items-center justify-between border-b p-4 bg-purple-50">
            <h2 className="text-lg font-bold flex items-center gap-2 text-purple-800">
              <ShoppingCart size={20} className="text-purple-600" />
              当前订单
              <span className="ml-2 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-600">
                {currentOrder.length} 项
              </span>
            </h2>
          </div>

          {/* Order Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentOrder.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                <ShoppingCart size={48} strokeWidth={1} />
                <p className="mt-4">暂未添加菜品</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentOrder.map(item => (
                  <div key={item.id} className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-bold text-gray-800">{item.name}</span>
                        <div className="text-sm text-gray-500 mt-1">
                          ¥{item.price.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-purple-600 text-xl">¥{(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {/* Remark Button */}
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => setEditingItem(item)}
                        className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                          item.remark === "打包" 
                            ? "bg-orange-100 text-orange-700" 
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.remark || "堂食"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals & Buttons */}
          <div className="border-t p-6 space-y-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-600">总金额</span>
              <span className="text-3xl font-black text-purple-600">¥{totalPrice.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-bold text-white shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95"
            >
              <CreditCard size={20} />
              去结账
            </button>
          </div>
        </div>
      </main>

      {/* Remark Modal for Item */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="mb-2 text-xl font-bold text-center">{editingItem.name}</h3>
            <p className="text-center text-gray-500 mb-6">选择用餐方式</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => updateItemRemark(editingItem.id, "堂食")}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                  editingItem.remark === "堂食" || !editingItem.remark
                  ? "border-purple-600 bg-purple-50 text-purple-600" 
                  : "border-gray-200 text-gray-400"
                }`}
              >
                <Utensils size={40} />
                <span className="font-bold">堂食</span>
              </button>
              <button
                onClick={() => updateItemRemark(editingItem.id, "打包")}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                  editingItem.remark === "打包"
                  ? "border-purple-600 bg-purple-50 text-purple-600" 
                  : "border-gray-200 text-gray-400"
                }`}
              >
                <Package size={40} />
                <span className="font-bold">打包</span>
              </button>
            </div>
            <button
              onClick={() => setEditingItem(null)}
              className="w-full rounded-xl bg-gray-200 py-4 font-bold text-gray-700 hover:bg-gray-300"
            >
              取 消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
