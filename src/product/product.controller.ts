import { Controller } from "@nestjs/common";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Metadata } from "@grpc/grpc-js";
import {
  GrpcService,
  GrpcMethod as GrpcMethodDecorator,
  GrpcMetadata,
  GrpcException,
} from "nestjs-grpc";
import { ProductService } from "./product.service";
import {
  GetProductRequest,
  ListProductsRequest,
  ListProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  DeleteProductRequest,
  DeleteProductResponse,
  WatchPriceUpdatesRequest,
  PriceUpdate,
  Product,
} from "../generated/product";

@Controller()
@GrpcService("ProductService")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod("ProductService", "GetProduct")
  @GrpcMethodDecorator({ methodName: "GetProduct", streaming: false })
  async getProduct(request: GetProductRequest): Promise<Product> {
    return this.productService.getProduct(request.id);
  }

  @GrpcMethod("ProductService", "ListProducts")
  @GrpcMethodDecorator({ methodName: "ListProducts", streaming: false })
  async listProducts(
    request: ListProductsRequest
  ): Promise<ListProductsResponse> {
    return this.productService.listProducts(request);
  }

  @GrpcMethod("ProductService", "CreateProduct")
  @GrpcMethodDecorator({ methodName: "CreateProduct", streaming: false })
  async createProduct(
    request: CreateProductRequest,
    @GrpcMetadata("user-id") userId: string
  ): Promise<Product> {
    // Example of using metadata for authorization
    if (!userId) {
      throw GrpcException.permissionDenied("User ID required in metadata");
    }

    return this.productService.createProduct(request, userId);
  }

  @GrpcMethod("ProductService", "UpdateProduct")
  @GrpcMethodDecorator({ methodName: "UpdateProduct", streaming: false })
  async updateProduct(request: UpdateProductRequest): Promise<Product> {
    return this.productService.updateProduct(request);
  }

  @GrpcMethod("ProductService", "DeleteProduct")
  @GrpcMethodDecorator({ methodName: "DeleteProduct", streaming: false })
  async deleteProduct(
    request: DeleteProductRequest
  ): Promise<DeleteProductResponse> {
    return this.productService.deleteProduct(request.id);
  }

  @GrpcStreamMethod("ProductService", "WatchPriceUpdates")
  @GrpcMethodDecorator({ methodName: "WatchPriceUpdates", streaming: true })
  watchPriceUpdates(
    request: WatchPriceUpdatesRequest,
    metadata: Metadata
  ): Observable<PriceUpdate> {
    // Example of accessing full metadata
    const clientId = metadata.get("client-id")[0]?.toString();
    const clientVersion = metadata.get("client-version")[0]?.toString();
    console.log(
      `Client ${clientId} (v${clientVersion}) watching price updates`
    );

    return this.productService.watchPriceUpdates(request.productIds);
  }
}
