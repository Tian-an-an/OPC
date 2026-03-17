import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppContext, Order } from "../context/AppContext";
import { toast } from "sonner";
import { ChevronLeft, CheckCircle2, Ticket, Calculator, Printer } from "lucide-react";
import { format } from "date-fns";

export function Checkout() {
  const { currentOrder, setCurrentOrder, setOrders, orders, orderType, settings } = useAppContext();
  const [discount, setDiscount] = useState<string>("0");
  const navigate = useNavigate();

  const baseTotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = parseFloat(discount) || 0;
  const finalTotal = Math.max(0, baseTotal - discountAmount);

  useEffect(() => {
    if (currentOrder.length === 0) {
      navigate("/pos");
    }
  }, [currentOrder, navigate]);

  const printReceipt = (order: Order) => {
    if (!settings.autoPrint) return;

    const printContent = `
      <div style="font-family: Arial, sans-serif; width: 300px; margin: 0 auto; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 20px;">${settings.storeName}</h2>
        <p style="text-align: center; margin-bottom: 20px; font-size: 14px;">${settings.cashierTitle}</p>
        <hr style="border: 1px dashed #ccc; margin: 10px 0;">
        <div style="margin: 10px 0;">
          <p style="font-size: 14px;">订单号: ${order.id}</p>
          <p style="font-size: 14px;">时间: ${order.time}</p>
          <p style="font-size: 14px;">类型: ${order.type}</p>
        </div>
        <hr style="border: 1px dashed #ccc; margin: 10px 0;">
        <div style="margin: 10px 0;">
          ${order.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px;">
              <span>${item.name} x ${item.quantity}</span>
              <span>¥${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <hr style="border: 1px dashed #ccc; margin: 10px 0;">
        <div style="margin: 10px 0;">
          <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px;">
            <span>订单总额</span>
            <span>¥${order.total.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px;">
            <span>折扣</span>
            <span>-¥${order.discount.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 16px; font-weight: bold;">
            <span>实付金额</span>
            <span>¥${order.finalTotal.toFixed(2)}</span>
          </div>
        </div>
        <hr style="border: 1px dashed #ccc; margin: 10px 0;">
        <p style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">感谢您的光临！</p>
      </div>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.id = 'print-iframe';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>订单小票</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      iframeDoc.close();

      iframe.contentWindow?.focus();
      
      setTimeout(() => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 300);
    } else {
      document.body.removeChild(iframe);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>订单小票</title></head>
            <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const handleComplete = () => {
    // 生成 YYYYMMDD + 序号格式的订单号
    const now = new Date();
    const dateStr = format(now, "yyyyMMdd");
    
    // 从 orders 中获取今天的订单数量作为序号
    const today = format(now, "yyyy-MM-dd");
    const todayOrders = orders.filter(o => o.time.startsWith(today));
    const sequence = todayOrders.length + 1;
    const orderId = `${dateStr}${String(sequence).padStart(3, '0')}`;

    const newOrder: Order = {
      id: orderId,
      items: [...currentOrder],
      total: baseTotal,
      discount: discountAmount,
      finalTotal: finalTotal,
      time: format(now, "yyyy-MM-dd HH:mm:ss"),
      type: orderType,
      status: "正常",
    };

    setOrders(prev => [newOrder, ...prev]);
    
    if (settings.autoPrint) {
      toast.success("结账完成，正在打印小票...");
      printReceipt(newOrder);
    } else {
      toast.success("结账完成");
    }
    
    // 跳转回点餐页面
    setTimeout(() => {
      setCurrentOrder([]);
      navigate("/pos");
    }, 1500);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 overflow-hidden select-none">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-white px-6 shadow-sm">
        <button 
          onClick={() => navigate("/pos")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold"
        >
          <ChevronLeft size={24} />
          返回点餐
        </button>
        <h1 className="text-xl font-bold text-gray-800">结 账</h1>
        <div className="w-24"></div> {/* spacer */}
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border space-y-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                   <Calculator size={20} />
                </div>
                <h2 className="text-xl font-bold">费用合计</h2>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center text-lg text-gray-600">
                   <span>订单总额</span>
                   <span className="font-bold text-gray-900">¥{baseTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-orange-500 font-medium">
                      <Ticket size={18} />
                      <span>折扣 / 抹零</span>
                   </div>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                      <input 
                        type="number"
                        step="0.1"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-32 rounded-xl border-2 border-orange-100 bg-orange-50/30 pl-8 pr-4 py-3 text-right font-bold text-orange-600 outline-none focus:border-orange-300 transition-all"
                        placeholder="0.00"
                        onFocus={(e) => e.target.select()}
                      />
                   </div>
                </div>

                <div className="h-px bg-dashed border-b border-gray-100 my-4"></div>

                <div className="flex justify-between items-center">
                   <span className="text-2xl font-black text-gray-800">实付金额</span>
                   <span className="text-5xl font-black text-red-600 tracking-tighter">
                      <small className="text-2xl mr-1 font-bold italic">¥</small>
                      {finalTotal.toFixed(2)}
                   </span>
                </div>
             </div>
          </div>

          {/* Right: Payment & Action */}
          <div className="flex flex-col gap-6">
             <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-24 w-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 size={64} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">准备结账</h3>
                <p className="text-gray-500">
                  确认订单无误后，点击下方完成按钮。我们将自动为您打印订单小票并更新库存。
                </p>
             </div>

             <button 
                onClick={handleComplete}
                className="w-full rounded-3xl bg-blue-600 py-8 font-black text-3xl text-white shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
             >
                完 成 结 账
             </button>
          </div>

        </div>
      </main>
    </div>
  );
}
