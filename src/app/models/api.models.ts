// Model interfaces for KURA APIs
// Must match actual API response structures

export interface SearchResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  serviceType: 'SINGLE' | 'BUNDLE';
  category?: string;
  basePrice: number;
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
  city: string;
  department: string;
}

// Enterprise API AuthResponse — token is null (cookie-only), user info is flat
export interface AuthResponse {
  token: string | null;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  cedula: string;
  phone?: string;
  consentLey1581: boolean;
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
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'SAMPLE_TAKEN' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  total: number;
  items: OrderItemResponse[];
  walkInTicket?: WalkInTicket;
  pos?: { name: string; address: string; phone?: string };
}

export interface OrderItemResponse {
  serviceCode: string;
  serviceName: string;
  quantity: number;
  price: number;
  unitPrice?: number;
}

export interface WalkInTicket {
  ticketCode: string;
  expiresAt: string;
}

export interface ShareResponse {
  patientName: string;
  serviceName: string | null;
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
