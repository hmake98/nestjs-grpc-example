import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as path from "path";

async function bootstrap() {
  const logger = new Logger("Main");

  // Create the main NestJS application
  const app = await NestFactory.create(AppModule);

  // Create a hybrid application with both HTTP and gRPC
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ["user", "product"],
      protoPath: [
        path.join(__dirname, "../protos/user.proto"),
        path.join(__dirname, "../protos/product.proto"),
      ],
      url: "localhost:5000",
    },
  });

  // Start the microservice
  await app.startAllMicroservices();
  logger.log("gRPC microservice running on: localhost:5000");

  // Start the HTTP server
  await app.listen(3000);
  logger.log("HTTP server running on: http://localhost:3000");
  logger.log(
    "gRPC Dashboard available at: http://localhost:3000/grpc-dashboard/api/info"
  );
}

bootstrap();
