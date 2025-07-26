// Order & Delivery Types

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'on_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'wallet';

export interface OrderProduct {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  area: string;
  phone: string;
  notes?: string;
  deliveryFee: number;
  driverId?: string;
  driverName?: string;
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
}

export interface Order {
  _id: string;
  userId: string;
  userName: string;
  userPhone: string;
  products: OrderProduct[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  delivery: DeliveryInfo;
}

export interface Driver {
  _id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'active' | 'inactive';
  assignedOrders: string[];
}

export interface DeliveryArea {
  _id: string;
  name: string;
  fee: number;
  isActive: boolean;
}
