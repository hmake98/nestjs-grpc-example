import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "PRODUCT_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "product",
          protoPath: join(__dirname, "../../protos/product.proto"),
          url: "localhost:50052",
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
