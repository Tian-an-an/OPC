import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: "on" | "off";
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  remark?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  discount: number;
  finalTotal: number;
  time: string;
  type: "堂食" | "打包";
  status: "正常" | "退单";
}

export interface Material {
  id: string;
  name: string;
  manufacturer: string;
  stock: number;
  minAlert: number;
}

export interface AppSettings {
  storeName: string;
  cashierTitle: string;
  cashierUsername: string;
  cashierPass: string;
  adminUsername: string;
  adminPass: string;
  autoPrint: boolean;
  printCopies: number;
}

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  currentOrder: OrderItem[];
  setCurrentOrder: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  orderType: "堂食" | "打包";
  setOrderType: React.Dispatch<React.SetStateAction<"堂食" | "打包">>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 默认初始数据
const defaultProducts: Product[] = [
  { id: "1", name: "鲜肉包", price: 2.5, category: "包子", status: "on" },
  { id: "2", name: "豆沙包", price: 2.0, category: "包子", status: "on" },
  { id: "3", name: "豆浆", price: 3.0, category: "饮品", status: "on" },
  { id: "4", name: "粥", price: 4.0, category: "主食", status: "on" },
  { id: "5", name: "茶叶蛋", price: 2.0, category: "小吃", status: "on" },
];

const defaultMaterials: Material[] = [
  { id: "m1", name: "面粉", manufacturer: "五得利", stock: 100, minAlert: 20 },
  { id: "m2", name: "猪肉", manufacturer: "双汇", stock: 50, minAlert: 10 },
  { id: "m3", name: "鸡蛋", manufacturer: "农家", stock: 200, minAlert: 30 },
];

// 密码加密函数
const hashPassword = (password: string): string => {
  // 使用简单的哈希算法，实际生产环境应使用更安全的算法
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
};

// 密码验证函数
const verifyPassword = (inputPassword: string, hashedPassword: string): boolean => {
  return hashPassword(inputPassword) === hashedPassword;
};

// LocalStorage keys
const STORAGE_KEYS = {
  PRODUCTS: "breakfast_products",
  MATERIALS: "breakfast_materials",
  ORDERS: "breakfast_orders",
  SETTINGS: "breakfast_settings",
  APP_VERSION: "breakfast_app_version",
};

const defaultSettings: AppSettings = {
  storeName: "早餐店",
  cashierTitle: "早餐店收银系统",
  cashierUsername: "123",
  cashierPass: hashPassword("123"),
  adminUsername: "admin",
  adminPass: hashPassword("admin"),
  autoPrint: true,
  printCopies: 1,
};

// 从 LocalStorage 加载数据
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
  }
  return defaultValue;
};

// 保存到 LocalStorage
const saveToStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// 应用版本号，每次打包时更改此值以触发数据重置
const APP_VERSION = "1.0.0";

// 强制清空localStorage数据，确保使用新的默认值
localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
localStorage.removeItem(STORAGE_KEYS.MATERIALS);
localStorage.removeItem(STORAGE_KEYS.ORDERS);
localStorage.removeItem(STORAGE_KEYS.SETTINGS);
localStorage.removeItem(STORAGE_KEYS.APP_VERSION);

// 直接设置版本号
localStorage.setItem(STORAGE_KEYS.APP_VERSION, APP_VERSION);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // 从 LocalStorage 加载初始数据，如果没有则使用默认值
  // 注意：为了确保每次打包时数据清空，这里使用空数组作为默认值
  const [products, setProducts] = useState<Product[]>(() => 
    loadFromStorage(STORAGE_KEYS.PRODUCTS, [])
  );
  const [materials, setMaterials] = useState<Material[]>(() => 
    loadFromStorage(STORAGE_KEYS.MATERIALS, [])
  );
  const [orders, setOrders] = useState<Order[]>(() => 
    loadFromStorage(STORAGE_KEYS.ORDERS, [])
  );
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<"堂食" | "打包">("堂食");
  const [settings, setSettings] = useState<AppSettings>(() => {
    // 直接使用默认设置，确保密码是正确的
    return defaultSettings;
  });

  // 数据变化时保存到 LocalStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MATERIALS, materials);
  }, [materials]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        materials,
        setMaterials,
        orders,
        setOrders,
        settings,
        setSettings,
        currentOrder,
        setCurrentOrder,
        orderType,
        setOrderType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}
