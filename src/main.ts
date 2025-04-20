import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    // Create the main application instance
    const app = await NestFactory.create(AppModule);

    // Create the User microservice
    const userMicroservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'user',
            protoPath: join(__dirname, '../protos/user.proto'),
            url: 'localhost:50051',
        },
    });

    // Create the Product microservice
    const productMicroservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'product',
            protoPath: join(__dirname, '../protos/product.proto'),
            url: 'localhost:50052',
        },
    });

    // Start all microservices
    await app.startAllMicroservices();

    // Start the HTTP server (for dashboard)
    await app.listen(3000);

    logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
