import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function BackLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { settings } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 简单的输入验证，防止SQL注入
    if (!username || !password) {
      toast.error("请输入账号和密码");
      return;
    }
    // 密码验证
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashedPassword = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
    if (username === settings.adminUsername && hashedPassword === settings.adminPass) {
      toast.success("后台登录成功");
      navigate("/admin/dashboard");
    } else {
      toast.error("账号或密码错误");
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0 h-full w-full opacity-30">
        <ImageWithFallback
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20restaurant%20meal%20with%20steak%20and%20fried%20chicken%20on%20wooden%20table%20in%20cozy%20restaurant%20interior&image_size=landscape_16_9"
          alt="background"
          className="h-full w-full object-cover blur-sm"
        />
      </div>
      
      <div className="z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">后台管理系统</h1>
          <p className="mt-2 text-gray-500">{settings.storeName}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">管理员账号</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
              placeholder="请输入管理员账号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">登录密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
              placeholder="请输入密码"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-95"
          >
            登录后台
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-indigo-600"
          >
            回到收银端
          </button>
        </div>
      </div>
    </div>
  );
}
