import { Module } from '@nestjs/common';
import { GrpcModule } from 'nestjs-grpc';
import { join } from 'path';
import { UserService } from './user.service';

@Module({
    imports: [
        GrpcModule.forRoot({
            protoPath: join(__dirname, '../../../proto/user.proto'),
            package: 'user',
            url: 'localhost:50051',
        }),
    ],
    providers: [UserService],
})
export class UserModule {}
