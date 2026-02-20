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
  private readonly b2cApi = environment.b2cApiUrl;
  private readonly enterpriseApi = environment.enterpriseApiUrl;

  constructor(private http: HttpClient) {}

  // Search endpoints (B2C API)
  searchServices(query: string, posId?: string, limit?: number): Observable<SearchResponse[]> {
    let params = new HttpParams().set('q', query);
    if (posId) params = params.set('posId', posId);
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get<SearchResponse[]>(`${this.b2cApi}/search/services`, { params });
  }

  getServiceByCode(code: string): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.b2cApi}/search/services/${code}`);
  }

  getPosLocations(): Observable<PosResponse[]> {
    return this.http.get<PosResponse[]>(`${this.b2cApi}/search/pos`);
  }

  // Auth endpoints (Enterprise API)
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.enterpriseApi}/auth/login`, { email, password });
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.enterpriseApi}/auth/register`, data);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.enterpriseApi}/auth/otp/send`, { email });
  }

  verifyOtp(email: string, code: string): Observable<any> {
    return this.http.post(`${this.enterpriseApi}/auth/otp/verify`, { email, code });
  }

  // Order endpoints (Enterprise API)
  createOrder(data: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.enterpriseApi}/commerce/orders`, data);
  }

  getOrder(orderNumber: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.enterpriseApi}/commerce/orders/${orderNumber}`);
  }

  getUserOrders(userId: string): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.enterpriseApi}/commerce/orders/user/${userId}`);
  }

  // Share endpoints (B2C API)
  getSharedResult(uuid: string): Observable<ShareResponse> {
    return this.http.get<ShareResponse>(`${this.b2cApi}/share/${uuid}`);
  }
}
