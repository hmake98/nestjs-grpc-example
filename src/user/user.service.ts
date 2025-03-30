import { Injectable, OnModuleInit } from "@nestjs/common";
import { Observable, interval, map } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { GrpcException } from "nestjs-grpc";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  DeleteUserResponse,
  UserRole,
} from "../generated/user";
import { users, UserData } from "./user.interface";

@Injectable()
export class UserService implements OnModuleInit {
  private users: UserData[] = [];

  onModuleInit() {
    // Initialize with sample data
    this.users = [...users];
  }

  /**
   * Get a user by ID
   */
  getUser(id: string): User {
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      throw GrpcException.notFound(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Create a new user
   */
  createUser(request: CreateUserRequest): User {
    // Check if email already exists
    const existingUser = this.users.find((u) => u.email === request.email);
    if (existingUser) {
      throw GrpcException.alreadyExists(
        `User with email ${request.email} already exists`,
        { email: request.email }
      );
    }

    const now = new Date().toISOString();
    const newUser: UserData = {
      id: uuidv4(),
      name: request.name,
      email: request.email,
      role: request.role || UserRole.USER,
      created_at: now,
      updated_at: now,
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Update an existing user
   */
  updateUser(request: UpdateUserRequest): User {
    const { id, ...updates } = request;
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw GrpcException.notFound(`User with ID ${id} not found`);
    }

    // Update only provided fields
    const user = this.users[userIndex];
    const updatedUser = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): DeleteUserResponse {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      throw GrpcException.notFound(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);

    return {
      success: true,
      message: `User with ID ${id} successfully deleted`,
    };
  }

  /**
   * Stream user updates with optional role filtering
   */
  watchUsers(roleFilter?: string): Observable<User> {
    // Filter users by role if provided
    let filteredUsers = [...this.users];
    if (roleFilter) {
      const roleValue =
        UserRole[roleFilter.toUpperCase() as keyof typeof UserRole];
      filteredUsers = filteredUsers.filter((user) => user.role === roleValue);
    }

    // Simulate streaming updates every 2 seconds
    return interval(2000).pipe(
      map((index) => {
        const userIndex = index % filteredUsers.length;
        return filteredUsers[userIndex];
      })
    );
  }
}
