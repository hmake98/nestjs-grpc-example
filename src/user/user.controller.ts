import { Controller } from "@nestjs/common";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Metadata } from "@grpc/grpc-js";
import {
  GrpcService,
  GrpcMethod as GrpcMethodDecorator,
  GrpcMetadata,
  GrpcAuthToken,
  GrpcException,
} from "nestjs-grpc";
import { UserService } from "./user.service";
import {
  GetUserRequest,
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  DeleteUserResponse,
  WatchUsersRequest,
  User,
} from "../generated/user";

@Controller()
@GrpcService("UserService")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod("UserService", "GetUser")
  @GrpcMethodDecorator({ methodName: "GetUser", streaming: false })
  async getUser(request: GetUserRequest, metadata: Metadata): Promise<User> {
    // Example of accessing metadata
    const traceId = metadata.get("trace-id")[0]?.toString() ?? "unknown";
    console.log(`Processing GetUser request with trace-id: ${traceId}`);

    return this.userService.getUser(request.id);
  }

  @GrpcMethod("UserService", "CreateUser")
  @GrpcMethodDecorator({ methodName: "CreateUser", streaming: false })
  async createUser(
    request: CreateUserRequest,
    metadata: Metadata,
    @GrpcAuthToken() token: string
  ): Promise<User> {
    // Example of using the auth token from metadata
    if (!token) {
      throw GrpcException.unauthenticated("Authentication required");
    }

    // In a real app, you would validate the token
    console.log(`Creating user with auth token: ${token}`);

    return this.userService.createUser(request);
  }

  @GrpcMethod("UserService", "UpdateUser")
  @GrpcMethodDecorator({ methodName: "UpdateUser", streaming: false })
  async updateUser(request: UpdateUserRequest): Promise<User> {
    return this.userService.updateUser(request);
  }

  @GrpcMethod("UserService", "DeleteUser")
  @GrpcMethodDecorator({ methodName: "DeleteUser", streaming: false })
  async deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(request.id);
  }

  @GrpcStreamMethod("UserService", "WatchUsers")
  @GrpcMethodDecorator({ methodName: "WatchUsers", streaming: true })
  watchUsers(
    request: WatchUsersRequest,
    @GrpcMetadata("client-id") clientId: string
  ): Observable<User> {
    // Example of accessing specific metadata
    console.log(
      `Client ${clientId} watching users with role filter: ${request.roleFilter}`
    );

    return this.userService.watchUsers(request.roleFilter);
  }
}
