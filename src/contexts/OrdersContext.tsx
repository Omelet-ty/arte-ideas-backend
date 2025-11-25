import React, { createContext, useContext, useState } from 'react';
import { CartItem } from './CartContext';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customerInfo: {
    fullName: string;
    phone: string;
    dni: string;
    email?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
  };
  deliveryType: 'delivery' | 'pickup';
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'processing' | 'in-preparation' | 'ready' | 'delivered';
  createdAt: Date;
  estimatedDeliveryDate: Date;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => string;
  getOrderById: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const generateOrderNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 3 }, () => 
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');
    const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `#${randomLetters}${randomNumbers}`;
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: generateOrderNumber(),
      createdAt: new Date(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
