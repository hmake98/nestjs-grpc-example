import { Injectable } from '@nestjs/common';
import { GrpcService, GrpcMethod, GrpcException } from 'nestjs-grpc';
import { User, UserById, CreateUserRequest, Users, Empty } from '../../generated/user';

@Injectable()
@GrpcService('UserService')
export class UserService {
    private users: User[] = [];

    @GrpcMethod('FindOne')
    findOne(data: UserById): User {
        const user = this.users.find(user => user.id === data.id);
        if (!user) {
            throw GrpcException.notFound(`User with ID ${data.id} not found`);
        }
        return user;
    }

    @GrpcMethod('FindAll')
    findAll(data: Empty): Users {
        return { users: this.users };
    }

    @GrpcMethod('Create')
    create(data: CreateUserRequest): User {
        const user: User = {
            id: Date.now().toString(),
            name: data.name,
            age: data.age,
            email: data.email,
        };

        this.users.push(user);
        return user;
    }
}
