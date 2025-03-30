import { Module } from "@nestjs/common";
import { GrpcModule, DashboardModule } from "nestjs-grpc";
import * as path from "path";
import { UserModule } from "./user/user.module";
import { ProductModule } from "./product/product.module";
import { ClientModule } from "./client/client.module";

@Module({
  imports: [
    // Configure the gRPC module
    GrpcModule.forRoot({
      // Path to the proto files
      protoPath: path.join(__dirname, "../protos"),

      // Base package name for services
      package: "",

      // URL for the gRPC server
      url: "localhost:50051",

      // Maximum message sizes (optional)
      maxSendMessageSize: 10 * 1024 * 1024, // 10MB
      maxReceiveMessageSize: 10 * 1024 * 1024, // 10MB

      // Proto loader options (optional)
      loaderOptions: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },

      // Logger options (optional)
      logger: {
        level: 3, // DEBUG level
        prettyPrint: true,
      },
    }),

    // Configure the dashboard module
    DashboardModule.register({
      // Enable the dashboard
      enable: true,

      // API endpoint prefix
      apiPrefix: "grpc-dashboard/api",

      // Maximum number of logs to keep in memory
      maxLogs: 2000,

      // CORS options for WebSocket
      cors: { origin: "*" },

      // GRPC server options
      grpcOptions: {
        url: "localhost:50051",
        package: "",
        protoPath: path.join(__dirname, "../protos"),
        logger: {
          level: 3, // DEBUG level
          prettyPrint: true,
        },
      },
    }),

    // Feature modules
    UserModule,
    ProductModule,
    ClientModule,
  ],
})
export class AppModule {}
