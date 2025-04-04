// This file is auto-generated by nestjs-grpc

import { Observable } from 'rxjs';

export interface ProductServiceClient {
  getProduct(request: GetProductRequest): Observable<Product>;
  listProducts(request: ListProductsRequest): Observable<ListProductsResponse>;
  createProduct(request: CreateProductRequest): Observable<Product>;
  updateProduct(request: UpdateProductRequest): Observable<Product>;
  deleteProduct(request: DeleteProductRequest): Observable<DeleteProductResponse>;
  watchPriceUpdates(request: WatchPriceUpdatesRequest): Observable<PriceUpdate>;
}

export interface ProductServiceInterface {
  getProduct(request: GetProductRequest): Promise<Product> | Observable<Product>;
  listProducts(request: ListProductsRequest): Promise<ListProductsResponse> | Observable<ListProductsResponse>;
  createProduct(request: CreateProductRequest): Promise<Product> | Observable<Product>;
  updateProduct(request: UpdateProductRequest): Promise<Product> | Observable<Product>;
  deleteProduct(request: DeleteProductRequest): Promise<DeleteProductResponse> | Observable<DeleteProductResponse>;
  watchPriceUpdates(request: WatchPriceUpdatesRequest): Observable<PriceUpdate>;
}

export interface GetProductRequest {
  id?: string;
}

export interface ListProductsRequest {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface ListProductsResponse {
  products?: Product[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}

export interface UpdateProductRequest {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}

export interface DeleteProductRequest {
  id?: string;
}

export interface DeleteProductResponse {
  success?: boolean;
  message?: string;
}

export interface WatchPriceUpdatesRequest {
  productIds?: string[];
}

export interface PriceUpdate {
  productId?: string;
  productName?: string;
  oldPrice?: number;
  newPrice?: number;
  updatedAt?: string;
}

export interface Product {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

