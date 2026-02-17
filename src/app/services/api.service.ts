import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  SearchResponse,
  PosResponse,
  AuthResponse,
  RegisterRequest,
  CreateOrderRequest,
  OrderResponse,
  ShareResponse,
} from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Search endpoints
  searchServices(query: string, posId?: string, limit?: number): Observable<SearchResponse[]> {
    let params = new HttpParams().set('q', query);
    if (posId) params = params.set('posId', posId);
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get<SearchResponse[]>(`${this.baseUrl}/search/services`, { params });
  }

  getServiceByCode(code: string): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.baseUrl}/search/services/${code}`);
  }

  getPosLocations(): Observable<PosResponse[]> {
    return this.http.get<PosResponse[]>(`${this.baseUrl}/search/pos`);
  }

  // Auth endpoints
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password });
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/otp/send`, { email });
  }

  verifyOtp(email: string, code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/otp/verify`, { email, code });
  }

  // Order endpoints
  createOrder(data: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/orders`, data);
  }

  getOrder(orderNumber: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/orders/${orderNumber}`);
  }

  getUserOrders(userId: string): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/orders/user/${userId}`);
  }

  // Share endpoints
  getSharedResult(uuid: string): Observable<ShareResponse> {
    return this.http.get<ShareResponse>(`${this.baseUrl}/share/${uuid}`);
  }
}
