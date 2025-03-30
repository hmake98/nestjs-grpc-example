import { Injectable, OnModuleInit } from "@nestjs/common";
import { Observable, interval, map } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { GrpcException } from "nestjs-grpc";
import {
  Product,
  ListProductsRequest,
  ListProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  DeleteProductResponse,
  PriceUpdate,
} from "../generated/product";
import { products, ProductData } from "./product.interface";

@Injectable()
export class ProductService implements OnModuleInit {
  private products: ProductData[] = [];

  onModuleInit() {
    // Initialize with sample data
    this.products = [...products];
  }

  /**
   * Get a product by ID
   */
  getProduct(id: string): Product {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw GrpcException.notFound(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * List products with optional filtering
   */
  listProducts(request: ListProductsRequest): ListProductsResponse {
    let filteredProducts = [...this.products];

    // Apply filters if provided
    if (request.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === request.category
      );
    }

    if (request.minPrice !== undefined && request.minPrice !== null) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= request.minPrice
      );
    }

    if (request.maxPrice !== undefined && request.maxPrice !== null) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= request.maxPrice
      );
    }

    // Calculate pagination
    const totalCount = filteredProducts.length;
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Get paginated results
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      totalCount,
      page,
      pageSize,
    };
  }

  /**
   * Create a new product
   */
  createProduct(request: CreateProductRequest, userId: string): Product {
    const now = new Date().toISOString();
    const newProduct: ProductData = {
      id: uuidv4(),
      name: request.name,
      description: request.description,
      price: request.price,
      category: request.category,
      stock: request.stock,
      available: request.stock > 0,
      created_at: now,
      updated_at: now,
    };

    // Log the user who created the product (in a real app, this would be stored)
    console.log(`Product created by user ${userId}`);

    this.products.push(newProduct);
    return newProduct;
  }

  /**
   * Update an existing product
   */
  updateProduct(request: UpdateProductRequest): Product {
    const { id, ...updates } = request;
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw GrpcException.notFound(`Product with ID ${id} not found`);
    }

    // Update only provided fields
    const product = this.products[productIndex];
    const updatedProduct = {
      ...product,
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.description !== undefined && {
        description: updates.description,
      }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.stock !== undefined && {
        stock: updates.stock,
        available: updates.stock > 0,
      }),
      updated_at: new Date().toISOString(),
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  /**
   * Delete a product
   */
  deleteProduct(id: string): DeleteProductResponse {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw GrpcException.notFound(`Product with ID ${id} not found`);
    }

    this.products.splice(productIndex, 1);

    return {
      success: true,
      message: `Product with ID ${id} successfully deleted`,
    };
  }

  /**
   * Stream price updates for specified products
   */
  watchPriceUpdates(productIds: string[]): Observable<PriceUpdate> {
    // Filter products by IDs if provided, or use all products if no IDs given
    let watchedProducts = this.products;
    if (productIds && productIds.length > 0) {
      watchedProducts = this.products.filter((p) => productIds.includes(p.id));
    }

    if (watchedProducts.length === 0) {
      throw GrpcException.invalidArgument("No valid products to watch");
    }

    // Simulate price updates every 3 seconds
    return interval(3000).pipe(
      map((index) => {
        const productIndex = index % watchedProducts.length;
        const product = watchedProducts[productIndex];

        // Simulate a random price change (+/- 5%)
        const priceDelta = (Math.random() * 10 - 5) / 100;
        const oldPrice = product.price;
        const newPrice = +(oldPrice * (1 + priceDelta)).toFixed(2);

        // Update the product price
        this.products.forEach((p) => {
          if (p.id === product.id) {
            p.price = newPrice;
            p.updated_at = new Date().toISOString();
          }
        });

        return {
          productId: product.id,
          productName: product.name,
          oldPrice: oldPrice,
          newPrice: newPrice,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }
}
