import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USER_PACKAGE",
        transport: Transport.GRPC,
        options: {
          package: "user",
          protoPath: join(__dirname, "../../protos/user.proto"),
          url: "localhost:50051",
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
