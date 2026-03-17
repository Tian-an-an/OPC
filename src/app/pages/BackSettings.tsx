import React, { useState } from "react";
import { BackLayout } from "../components/BackLayout";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { 
  Store, 
  Lock, 
  Printer, 
  ShieldCheck, 
  Save, 
  UserCircle,
  Eye,
  EyeOff
} from "lucide-react";

export function BackSettings() {
  const { settings, setSettings } = useAppContext();
  const navigate = useNavigate();
  
  const [storeName, setStoreName] = useState(settings.storeName);
  const [cashierTitle, setCashierTitle] = useState(settings.cashierTitle);
  const [cashierUsername, setCashierUsername] = useState(settings.cashierUsername);
  const [cashierPass, setCashierPass] = useState(settings.cashierPass);
  const [adminUsername, setAdminUsername] = useState(settings.adminUsername);
  const [adminPass, setAdminPass] = useState(settings.adminPass);
  const [autoPrint, setAutoPrint] = useState(settings.autoPrint);
  const [printCopies, setPrintCopies] = useState(settings.printCopies);

  const [showCashierPass, setShowCashierPass] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);

  const handleSaveBasic = () => {
    setSettings(prev => ({ ...prev, storeName, cashierTitle }));
    toast.success("基础设置已保存");
  };

  const handleSaveCashierPass = () => {
    // 密码加密
    const encoder = new TextEncoder();
    const data = encoder.encode(cashierPass);
    const hashedPassword = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
    setSettings(prev => ({ ...prev, cashierUsername, cashierPass: hashedPassword }));
    toast.success("收银员账号和密码已修改");
  };

  const handleSaveAdminPass = () => {
    // 密码加密
    const encoder = new TextEncoder();
    const data = encoder.encode(adminPass);
    const hashedPassword = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
    setSettings(prev => ({ ...prev, adminUsername, adminPass: hashedPassword }));
    toast.success("管理员账号和密码已修改，正在跳转到登录页面...");
    setTimeout(() => {
      navigate("/admin");
    }, 1500);
  };

  const handleSavePrint = () => {
    setSettings(prev => ({ ...prev, autoPrint, printCopies }));
    toast.success("打印设置已保存");
  };

  return (
    <BackLayout title="系统设置">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Section 1: Basic Settings */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Store size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800">基础设置</h3>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">门店名称</label>
                    <input 
                      type="text" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">收银端标题</label>
                    <input 
                      type="text" 
                      value={cashierTitle}
                      onChange={(e) => setCashierTitle(e.target.value)}
                      className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                 </div>
              </div>
           </div>
           
           <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveBasic}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                 <Save size={18} />
                 保存基础设置
              </button>
           </div>
        </div>

        {/* Section 2: Cashier Pass */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                    <UserCircle size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800">收银员账号管理</h3>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">收银员账号</label>
                    <input 
                      type="text"
                      value={cashierUsername}
                      onChange={(e) => setCashierUsername(e.target.value)}
                      className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">收银员密码</label>
                    <div className="relative">
                       <input 
                         type={showCashierPass ? "text" : "password"}
                         value={cashierPass}
                         onChange={(e) => setCashierPass(e.target.value)}
                         className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                       />
                       <button 
                         onClick={() => setShowCashierPass(!showCashierPass)}
                         className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                          {showCashierPass ? <EyeOff size={20} /> : <Eye size={20} />}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveCashierPass}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
              >
                 <ShieldCheck size={18} />
                 保存账号和密码修改
              </button>
           </div>
        </div>

        {/* Section 3: Admin Pass */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Lock size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800">管理员账号管理</h3>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">管理员账号</label>
                    <input 
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">管理员密码</label>
                    <div className="relative">
                       <input 
                         type={showAdminPass ? "text" : "password"}
                         value={adminPass}
                         onChange={(e) => setAdminPass(e.target.value)}
                         className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                       />
                       <button 
                         onClick={() => setShowAdminPass(!showAdminPass)}
                         className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                          {showAdminPass ? <EyeOff size={20} /> : <Eye size={20} />}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveAdminPass}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                 <ShieldCheck size={18} />
                 保存账号和密码修改
              </button>
           </div>
        </div>

        {/* Section 4: Print Settings */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-12 w-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <Printer size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800">打印设置</h3>
              </div>
              
              <div className="space-y-8">
                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="font-bold text-gray-700">结账后自动打印小票</span>
                    <button 
                      onClick={() => setAutoPrint(!autoPrint)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${autoPrint ? "bg-green-500" : "bg-gray-300"}`}
                    >
                       <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${autoPrint ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">默认打印份数</label>
                    <select 
                      value={printCopies}
                      onChange={(e) => setPrintCopies(parseInt(e.target.value))}
                      className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
                    >
                       <option value={1}>1 份 (默认)</option>
                       <option value={2}>2 份</option>
                       <option value={3}>3 份</option>
                    </select>
                 </div>
              </div>
           </div>
           
           <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSavePrint}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
              >
                 <Save size={18} />
                 保存打印配置
              </button>
           </div>
        </div>

      </div>
    </BackLayout>
  );
}
