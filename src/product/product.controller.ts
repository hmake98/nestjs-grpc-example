import { Controller } from "@nestjs/common";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Metadata } from "@grpc/grpc-js";
import { GrpcService } from "nestjs-grpc";
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
@GrpcService({
  serviceName: "ProductService",
  package: "product",
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod("GetProduct")
  getProduct(request: GetProductRequest): Promise<Product> {
    return Promise.resolve(this.productService.getProduct(request.id));
  }

  @GrpcMethod("ListProducts")
  listProducts(request: ListProductsRequest): Promise<ListProductsResponse> {
    return Promise.resolve(this.productService.listProducts(request));
  }

  @GrpcMethod("CreateProduct")
  createProduct(
    request: CreateProductRequest,
    metadata: Metadata
  ): Promise<Product> {
    // Extract userId from metadata
    const userId = metadata.get("user-id")[0]?.toString() || "unknown";
    return Promise.resolve(this.productService.createProduct(request, userId));
  }

  @GrpcMethod("UpdateProduct")
  updateProduct(request: UpdateProductRequest): Promise<Product> {
    return Promise.resolve(this.productService.updateProduct(request));
  }

  @GrpcMethod("DeleteProduct")
  deleteProduct(request: DeleteProductRequest): Promise<DeleteProductResponse> {
    return Promise.resolve(this.productService.deleteProduct(request.id));
  }

  @GrpcStreamMethod("WatchPriceUpdates")
  watchPriceUpdates(
    request: WatchPriceUpdatesRequest,
    metadata: Metadata
  ): Observable<PriceUpdate> {
    // Extract client information from metadata (optional)
    const clientId = metadata.get("client-id")[0]?.toString() || "unknown";
    const clientVersion =
      metadata.get("client-version")[0]?.toString() || "unknown";

    console.log(
      `Client ${clientId} (v${clientVersion}) watching price updates`
    );

    return this.productService.watchPriceUpdates(request.productIds);
  }
}
