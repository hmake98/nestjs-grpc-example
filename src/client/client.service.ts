import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { GrpcClientFactory, MetadataUtils } from "nestjs-grpc";
import { firstValueFrom, Observable } from "rxjs";
import { User, CreateUserRequest, UserServiceClient } from "../generated/user";
import {
  Product,
  ListProductsRequest,
  ListProductsResponse,
  CreateProductRequest,
  PriceUpdate,
  ProductServiceClient,
} from "../generated/product";

@Injectable()
export class ClientService implements OnModuleInit {
  private userClient: UserServiceClient;
  private productClient: ProductServiceClient;
  private logger = new Logger(ClientService.name);

  constructor(private readonly clientFactory: GrpcClientFactory) {}

  onModuleInit() {
    // Try multiple service name formats to find the correct one
    try {
      // Try with specific formats
      const servicePrefixes = ["user.", "user_package.", ""];
      const serviceNames = ["UserService", "User", "UserClient", "userService"];

      // Try all combinations
      let userServiceFound = false;

      for (const prefix of servicePrefixes) {
        for (const name of serviceNames) {
          try {
            const serviceName = `${prefix}${name}`;
            this.logger.log(
              `Trying to create client for service: ${serviceName}`
            );

            const client = this.clientFactory.create<any>(serviceName, {
              url: "localhost:5000",
            });

            // Check if client has the expected methods
            if (client && typeof client.getUser === "function") {
              this.userClient = client;
              this.logger.log(
                `Successfully created UserService client with name: ${serviceName}`
              );
              userServiceFound = true;
              break;
            } else {
              // Log the methods available on this client
              const methods = client
                ? Object.keys(client).filter(
                    (key) => typeof client[key] === "function"
                  )
                : [];
              this.logger.debug(
                `Found service ${serviceName} but it doesn't have expected methods. Available methods: ${methods.join(", ")}`
              );
            }
          } catch (error) {
            // Continue to next name
          }
        }

        if (userServiceFound) break;
      }

      if (!userServiceFound) {
        this.logger.warn(
          "Could not find UserService with expected methods. Client functionality will be limited."
        );
      }
    } catch (error) {
      this.logger.error(`Error creating UserService client: ${error.message}`);
    }

    // Create product client
    try {
      this.productClient = this.clientFactory.create<ProductServiceClient>(
        "product.ProductService",
        {
          url: "localhost:5000",
        }
      );
      this.logger.log("ProductService client created successfully");
    } catch (error) {
      this.logger.error(
        `Error creating ProductService client: ${error.message}`
      );
    }

    // Demonstrate client usage with a few examples
    this.demonstrateClientUsage();
  }

  /**
   * Demonstrates how to use the gRPC clients
   */
  private async demonstrateClientUsage() {
    try {
      // Example 1: Get a user with trace ID metadata
      if (this.userClient && typeof this.userClient.getUser === "function") {
        try {
          const user = await this.userClient.getUser({ id: "1" });
          console.log("Retrieved user:", user);
        } catch (error) {
          console.error("Error getting user:", error.message);
        }
      } else {
        console.log("UserService not available or getUser method not found");
      }

      // Example 2: List products with category filter
      if (
        this.productClient &&
        typeof this.productClient.listProducts === "function"
      ) {
        try {
          const products = await firstValueFrom(
            this.productClient.listProducts({
              category: "electronics",
              page: 1,
              pageSize: 10, // Note: Snake case to match proto definition
            })
          );

          // Handle potential differences in field names
          const productsArray = products.products || [];
          const totalCount = products.totalCount || products.totalCount || 0;

          console.log(
            `Retrieved ${productsArray.length} products out of ${totalCount}`
          );
        } catch (error) {
          console.error("Error listing products:", error.message);
        }
      } else {
        console.log(
          "ProductService not available or listProducts method not found"
        );
      }

      // Example 3: Create a product with authentication metadata
      if (
        this.productClient &&
        typeof this.productClient.createProduct === "function"
      ) {
        const authMetadata = MetadataUtils.withAuthToken("demo-token");
        authMetadata.add("user-id", "demo-admin");

        try {
          const newProduct = await this.productClient.createProduct({
            name: "Demo Product",
            description: "A product created from the client demo",
            price: 29.99,
            category: "demo",
            stock: 100,
          });
          console.log("Created product:", newProduct);
        } catch (error) {
          console.error("Error creating product:", error.message);
        }
      }

      // Example 4: Subscribe to price updates
      if (
        this.productClient &&
        typeof this.productClient.watchPriceUpdates === "function"
      ) {
        try {
          const priceUpdates = this.productClient.watchPriceUpdates({
            productIds: ["1", "2"],
          });

          const subscription = priceUpdates.subscribe({
            next: (update) => {
              // Handle potential differences in field names
              const productName = update.productName || update.productName;
              const oldPrice = update.oldPrice || update.oldPrice;
              const newPrice = update.newPrice || update.newPrice;

              console.log(
                `Price update for ${productName}: $${oldPrice} -> $${newPrice}`
              );
            },
            error: (err) => {
              console.error("Error in price update stream:", err);
            },
            complete: () => {
              console.log("Price update stream completed");
            },
          });

          // Unsubscribe after 10 seconds to clean up
          setTimeout(() => {
            subscription.unsubscribe();
            console.log("Unsubscribed from price updates");
          }, 10000);
        } catch (error) {
          console.error("Error watching price updates:", error.message);
        }
      }
    } catch (error) {
      console.error("Error in client demo:", error);
    }
  }

  /**
   * Public method to get a user
   */
  async getUser(id: string): Promise<User> {
    if (!this.userClient || typeof this.userClient.getUser !== "function") {
      throw new Error("UserService not available or getUser method not found");
    }
    return this.userClient.getUser({ id });
  }

  /**
   * Public method to get a product
   */
  async getProduct(id: string): Promise<Product> {
    if (
      !this.productClient ||
      typeof this.productClient.getProduct !== "function"
    ) {
      throw new Error(
        "ProductService not available or getProduct method not found"
      );
    }
    return this.productClient.getProduct({ id });
  }

  /**
   * Public method to list products
   */
  async listProducts(
    options: ListProductsRequest
  ): Promise<ListProductsResponse> {
    if (
      !this.productClient ||
      typeof this.productClient.listProducts !== "function"
    ) {
      throw new Error(
        "ProductService not available or listProducts method not found"
      );
    }
    return this.productClient.listProducts(options);
  }

  /**
   * Public method to create a user with auth token
   */
  async createUser(userData: CreateUserRequest, token: string): Promise<User> {
    if (!this.userClient || typeof this.userClient.createUser !== "function") {
      throw new Error(
        "UserService not available or createUser method not found"
      );
    }
    const metadata = MetadataUtils.withAuthToken(token);
    return this.userClient.createUser(userData, metadata);
  }

  /**
   * Public method to create a product with user ID
   */
  async createProduct(
    productData: CreateProductRequest,
    userId: string
  ): Promise<Product> {
    if (
      !this.productClient ||
      typeof this.productClient.createProduct !== "function"
    ) {
      throw new Error(
        "ProductService not available or createProduct method not found"
      );
    }
    const metadata = MetadataUtils.fromObject({ "user-id": userId });
    return this.productClient.createProduct(productData, metadata);
  }

  /**
   * Public method to watch user updates
   */
  watchUsers(roleFilter?: string): Observable<User> {
    if (!this.userClient || typeof this.userClient.watchUsers !== "function") {
      throw new Error(
        "UserService not available or watchUsers method not found"
      );
    }
    const metadata = MetadataUtils.fromObject({
      "client-id": "app-client",
      "trace-id": `trace-${Date.now()}`,
    });
    return this.userClient.watchUsers({ roleFilter }, metadata);
  }

  /**
   * Public method to watch price updates
   */
  watchPriceUpdates(productIds: string[]): Observable<PriceUpdate> {
    if (
      !this.productClient ||
      typeof this.productClient.watchPriceUpdates !== "function"
    ) {
      throw new Error(
        "ProductService not available or watchPriceUpdates method not found"
      );
    }
    const metadata = MetadataUtils.fromObject({
      "client-id": "app-client",
      "client-version": "1.0.0",
    });
    return this.productClient.watchPriceUpdates(
      { product_ids: productIds },
      metadata
    );
  }
}
