import React, { useState } from "react";
import { BackLayout } from "../components/BackLayout";
import { useAppContext, Material } from "../context/AppContext";
import { toast } from "sonner";
import { Plus, Search, Filter, AlertCircle, Edit, MoreVertical, Package } from "lucide-react";

export function BackInventory() {
  const { materials, setMaterials } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [mfrTerm, setMfrTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formName, setFormName] = useState("");
  const [formMfr, setFormMfr] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formAlert, setFormAlert] = useState("");

  const filteredMaterials = materials.filter(m => {
    const matchesName = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMfr = m.manufacturer.toLowerCase().includes(mfrTerm.toLowerCase());
    const isLow = m.stock <= m.minAlert;
    const matchesStatus = statusFilter === 'all' || 
                       (statusFilter === 'low' && isLow) ||
                       (statusFilter === 'normal' && !isLow);
    return matchesName && matchesMfr && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setFormName("");
    setFormMfr("");
    setFormStock("");
    setFormAlert("");
    setShowAddModal(true);
  };

  const handleOpenEdit = (m: Material) => {
    setEditingMaterial(m);
    setFormName(m.name);
    setFormMfr(m.manufacturer);
    setFormStock(m.stock.toString());
    setFormAlert(m.minAlert.toString());
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formName || !formMfr || !formStock || !formAlert) {
      toast.error("请完整填写表单");
      return;
    }

    const stock = parseFloat(formStock);
    const alert = parseFloat(formAlert);
    if (isNaN(stock) || isNaN(alert)) {
      toast.error("数值格式不正确");
      return;
    }

    if (editingMaterial) {
      setMaterials(prev => prev.map(m => m.id === editingMaterial.id ? { 
        ...m, name: formName, manufacturer: formMfr, stock: stock, minAlert: alert 
      } : m));
      toast.success("原材料更新成功");
    } else {
      const newM: Material = {
        id: "m" + Date.now().toString().slice(-6),
        name: formName,
        manufacturer: formMfr,
        stock: stock,
        minAlert: alert,
      };
      setMaterials(prev => [...prev, newM]);
      toast.success("原材料新增成功");
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    toast.success("原材料删除成功");
  };

  return (
    <BackLayout title="库存管理">
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        
        {/* Search Header */}
        <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                 <Package size={24} className="text-green-600" />
                 库存列表
              </h2>
              <button 
                onClick={handleOpenAdd}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                 <Plus size={20} />
                 新增原材料
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-12 pr-6 py-3 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                   placeholder="搜索原材料名称..."
                 />
              </div>
              <div className="relative">
                 <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   value={mfrTerm}
                   onChange={(e) => setMfrTerm(e.target.value)}
                   className="w-full pl-12 pr-6 py-3 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium"
                   placeholder="搜索厂家..."
                 />
              </div>
              <div className="relative">
                 <select
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                   className="w-full pl-12 pr-6 py-3 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                 >
                   <option value="all">全部状态</option>
                   <option value="low">库存不足</option>
                   <option value="normal">库存充足</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 font-bold text-xs uppercase tracking-widest border-b">
                    <th className="px-4 sm:px-8 py-4">原材料</th>
                    <th className="px-4 sm:px-8 py-4">生产厂商</th>
                    <th className="px-4 sm:px-8 py-4">当前库存</th>
                    <th className="px-4 sm:px-8 py-4">预警阈值</th>
                    <th className="px-4 sm:px-8 py-4">状态</th>
                    <th className="px-4 sm:px-8 py-4 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredMaterials.map(m => {
                    const isLow = m.stock <= m.minAlert;
                    return (
                      <tr key={m.id} className={`hover:bg-gray-50/30 transition-all ${isLow ? "bg-red-50/30" : ""}`}>
                        <td className="px-4 sm:px-8 py-4 font-bold text-gray-800 break-all">{m.name}</td>
                        <td className="px-4 sm:px-8 py-4 text-gray-500 break-all">{m.manufacturer}</td>
                        <td className="px-4 sm:px-8 py-4 font-black text-gray-900">{m.stock}</td>
                        <td className="px-4 sm:px-8 py-4 text-gray-400">{m.minAlert}</td>
                        <td className="px-4 sm:px-8 py-4">
                           {isLow ? (
                             <span className="inline-flex items-center gap-1 text-xs font-black text-red-600 bg-red-100 px-2 sm:px-3 py-1 rounded-full animate-pulse">
                               <AlertCircle size={14} />
                               库存不足
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1 text-xs font-black text-green-600 bg-green-100 px-2 sm:px-3 py-1 rounded-full">
                               库存充足
                             </span>
                           )}
                        </td>
                        <td className="px-4 sm:px-8 py-4 text-center">
                           <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-2">
                              <button 
                                onClick={() => handleOpenEdit(m)}
                                className="flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all w-full sm:w-auto"
                              >
                                 编辑
                              </button>
                              <button 
                                onClick={() => handleDelete(m.id)}
                                className="flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-100 transition-all w-full sm:w-auto"
                              >
                                 删除
                              </button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl animate-in zoom-in duration-200">
             <h3 className="mb-8 text-2xl font-black text-gray-800">{editingMaterial ? "更新物料" : "新增物料"}</h3>
             <div className="space-y-5">
                <div>
                   <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">物料名称</label>
                   <input 
                     type="text" 
                     value={formName}
                     onChange={(e) => setFormName(e.target.value)}
                     className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                     placeholder="物料名称..."
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">供应商/厂家</label>
                   <input 
                     type="text" 
                     value={formMfr}
                     onChange={(e) => setFormMfr(e.target.value)}
                     className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                     placeholder="供应商名称..."
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">当前库存</label>
                      <input 
                        type="number" 
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="0"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">最低预警值</label>
                      <input 
                        type="number" 
                        value={formAlert}
                        onChange={(e) => setFormAlert(e.target.value)}
                        className="w-full rounded-2xl bg-gray-50 border-0 px-6 py-4 text-lg font-black text-red-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="0"
                      />
                   </div>
                </div>
             </div>

             <div className="mt-10 flex gap-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-500 hover:bg-gray-200 transition-all active:scale-95"
                >
                   取 消
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                   保存入库
                </button>
             </div>
          </div>
        </div>
      )}
    </BackLayout>
  );
}
