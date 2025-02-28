import { Injectable, OnModuleInit } from "@nestjs/common";
import { GrpcClientFactory } from "nestjs-grpc";
import {
  User,
  UserServiceClient,
  CreateUserRequest,
} from "../../generated/user";
import { firstValueFrom } from "rxjs";

@Injectable()
export class UserService implements OnModuleInit {
  private userClient: UserServiceClient;

  constructor(private grpcClientFactory: GrpcClientFactory) {}

  onModuleInit() {
    this.userClient =
      this.grpcClientFactory.create<UserServiceClient>("UserService");
  }

  async getUserById(id: string): Promise<User> {
    return firstValueFrom(this.userClient.findOne({ id }));
  }

  async getAllUsers(): Promise<User[]> {
    const response = await firstValueFrom(this.userClient.findAll({}));
    return response.users || [];
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    return firstValueFrom(this.userClient.create(data));
  }
}
