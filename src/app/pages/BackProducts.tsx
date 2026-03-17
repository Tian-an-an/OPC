import React, { useState } from "react";
import { BackLayout } from "../components/BackLayout";
import { useAppContext, Product } from "../context/AppContext";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Power, Search, Filter } from "lucide-react";

export function BackProducts() {
  const { products, setProducts } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 过滤商品列表
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName("");
    setFormPrice("");
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName || !formPrice) {
      toast.error("请完整填写表单");
      return;
    }

    const price = parseFloat(formPrice);
    
    // 价格校验
    if (isNaN(price)) {
      toast.error("价格请输入有效的数字");
      return;
    }
    
    if (price < 0) {
      toast.error("价格不能为负数");
      return;
    }
    
    if (price === 0) {
      toast.error("价格不能为0");
      return;
    }
    
    if (price > 99999) {
      toast.error("价格不能超过99999");
      return;
    }
    
    // 检查是否包含非法字符
    const invalidChars = /[^\d.]/;
    if (invalidChars.test(formPrice)) {
      toast.error("价格只能包含数字和小数点");
      return;
    }
    
    // 检查小数位数
    const decimalPart = formPrice.split('.')[1];
    if (decimalPart && decimalPart.length > 2) {
      toast.error("价格最多保留两位小数");
      return;
    }

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, name: formName, price: price } : p));
      toast.success("商品修改成功");
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: formName,
        price: price,
        category: "其它",
        status: "on",
      };
      setProducts(prev => [...prev, newProduct]);
      toast.success("商品添加成功");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.info("商品已删除");
  };

  const toggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "on" ? "off" : "on" } : p));
  };

  return (
    <BackLayout title="商品管理">
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden animate-in slide-in-from-bottom duration-500">
        <div className="p-8 border-b flex items-center justify-between bg-gray-50/50">
           <div className="flex items-center gap-6">
              <h2 className="text-xl font-black text-gray-800">所有菜品 ({filteredProducts.length})</h2>
              <div className="relative">
                 <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-12 pr-6 py-3 bg-white rounded-2xl border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-80 shadow-sm"
                   placeholder="输入菜品名称查询..."
                 />
                 {searchQuery && (
                   <button
                     onClick={() => setSearchQuery("")}
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   >
                     ✕
                   </button>
                 )}
              </div>
           </div>
           <button 
             onClick={handleOpenAdd}
             className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
           >
             <Plus size={24} />
             添加菜品
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-800 font-black text-lg tracking-wider border-b">
                <th className="px-8 py-8">菜品名称</th>
                <th className="px-8 py-8">售价</th>
                <th className="px-8 py-8">上架状态</th>
                <th className="px-8 py-8 text-center">操作栏</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-gray-400">
                    {searchQuery ? "未找到匹配的商品" : "暂无商品数据"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-all">
                    <td className="px-8 py-8">
                     <span className="text-lg font-bold text-gray-800">{product.name}</span>
                  </td>
                  <td className="px-8 py-8">
                     <span className="text-xl text-orange-500 font-black">¥{product.price.toFixed(2)}</span>
                  </td>
                    <td className="px-8 py-8">
                       <span className={`inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-sm font-bold ${
                         product.status === "on" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                       }`}>
                        <div className={`h-2 w-2 rounded-full ${product.status === "on" ? "bg-green-500" : "bg-gray-400"}`}></div>
                        {product.status === "on" ? "已上架" : "已下架"}
                     </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-center gap-5">
                        <button 
                          onClick={() => toggleStatus(product.id)}
                          className={`p-3.5 rounded-2xl transition-all ${
                            product.status === "on" ? "text-gray-400 hover:text-orange-500 hover:bg-orange-50" : "text-green-500 hover:bg-green-50"
                          }`}
                          title={product.status === "on" ? "下架" : "上架"}
                        >
                          <Power size={26} />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="p-3.5 rounded-2xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          title="编辑"
                        >
                          <Edit2 size={26} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-3.5 rounded-2xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="删除"
                        >
                          <Trash2 size={26} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="mb-8 text-2xl font-black text-gray-800">{editingProduct ? "编辑菜品" : "新增菜品"}</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">菜品名称</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-100 px-6 py-4 text-lg font-bold outline-none focus:border-indigo-500 transition-all"
                  placeholder="请输入菜品名称"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase mb-2 tracking-widest">销售单价 (¥)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    // 只允许数字和小数点
                    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                      setFormPrice(value);
                    }
                  }}
                  className="w-full rounded-2xl border-2 border-gray-100 px-6 py-4 text-lg font-black text-orange-600 outline-none focus:border-indigo-500 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="mt-10 flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-500 hover:bg-gray-200 transition-all active:scale-95"
              >
                取 消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                保 存
              </button>
            </div>
          </div>
        </div>
      )}
    </BackLayout>
  );
}
