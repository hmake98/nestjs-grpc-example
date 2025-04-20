import { Controller } from "@nestjs/common";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Metadata } from "@grpc/grpc-js";
import { GrpcService, GrpcException } from "nestjs-grpc";
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
@GrpcService({
  serviceName: "UserService",
  package: "user",
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod("GetUser")
  getUser(request: GetUserRequest, metadata: Metadata): Promise<User> {
    // Extract trace ID from metadata (optional)
    const traceId = metadata.get("trace-id")[0]?.toString() || "unknown";
    console.log(`Processing GetUser request with trace-id: ${traceId}`);

    return Promise.resolve(this.userService.getUser(request.id));
  }

  @GrpcMethod("CreateUser")
  createUser(request: CreateUserRequest, metadata: Metadata): Promise<User> {
    // Extract auth token from metadata
    const authHeader = metadata.get("authorization")[0]?.toString();
    let token = "";

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // Validate auth token
    if (!token) {
      throw GrpcException.unauthenticated("Authentication required");
    }

    console.log(`Creating user with auth token: ${token}`);
    return Promise.resolve(this.userService.createUser(request));
  }

  @GrpcMethod("UpdateUser")
  updateUser(request: UpdateUserRequest): Promise<User> {
    return Promise.resolve(this.userService.updateUser(request));
  }

  @GrpcMethod("DeleteUser")
  deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    return Promise.resolve(this.userService.deleteUser(request.id));
  }

  @GrpcStreamMethod("WatchUsers")
  watchUsers(request: WatchUsersRequest, metadata: Metadata): Observable<User> {
    // Extract client ID from metadata
    const clientId = metadata.get("client-id")[0]?.toString() || "unknown";

    console.log(
      `Client ${clientId} watching users with role filter: ${request.roleFilter}`
    );

    return this.userService.watchUsers(request.roleFilter);
  }
}
