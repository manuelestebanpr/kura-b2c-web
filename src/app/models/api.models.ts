// Model interfaces for KURA B2C API

export interface SearchResponse {
  code: string;
  name: string;
  description?: string;
  type: 'SINGLE' | 'BUNDLE';
  categoryCode: string;
  categoryName: string;
  basePrice: number;
  requiresFasting?: boolean;
  requiresAppointment?: boolean;
  estimatedDurationMinutes?: number;
  items?: BundleItem[];
}

export interface BundleItem {
  code: string;
  name: string;
  description?: string;
}

export interface PosResponse {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  cedula: string;
  phone?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  cedula: string;
  phone?: string;
}

export interface CreateOrderRequest {
  items: OrderItemRequest[];
  posId: string;
  patientEmail?: string;
  patientCedula?: string;
}

export interface OrderItemRequest {
  serviceCode: string;
  quantity: number;
}

export interface OrderResponse {
  orderNumber: string;
  status: 'PENDING' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  totalAmount: number;
  items: OrderItemResponse[];
  pos: PosResponse;
  patient?: User;
  walkInTicket?: WalkInTicket;
}

export interface OrderItemResponse {
  serviceCode: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface WalkInTicket {
  ticketCode: string;
  expiresAt: string;
  qrCode?: string;
}

export interface ShareResponse {
  uuid: string;
  patientName: string;
  serviceName: string;
  resultData: string;
  sharedAt: string;
  expiresAt: string;
}

export interface CartItem {
  service: SearchResponse;
  posId: string;
  posName?: string;
  quantity: number;
}
