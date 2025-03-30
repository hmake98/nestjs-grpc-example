# NestJS gRPC Example

This repository demonstrates how to use the `nestjs-grpc` package to create a gRPC microservice with NestJS. It includes examples of gRPC service definitions, implementation, client usage, and dashboard configuration.

## Features

- ✅ Complete gRPC service definitions using Protocol Buffers
- ✅ Type-safe client/server implementation
- ✅ Exception handling with the GrpcExceptionFilter
- ✅ Metadata handling and authentication
- ✅ Streaming endpoint examples
- ✅ Dashboard module for monitoring gRPC services
- ✅ Practical examples for User and Product services

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Installation

1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/nestjs-grpc-example.git
   cd nestjs-grpc-example
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Generate TypeScript definitions from Protocol Buffer files
   ```bash
   npm run proto:generate
   ```

## Running the Application

Start the application in development mode:
```bash
npm run start:dev
```

This will start both:
- The gRPC server on port 5000
- The HTTP server on port 3000 (for the dashboard)

## Project Structure

- `protos/` - Protocol Buffer definitions
  - `user.proto` - User service definition
  - `product.proto` - Product service definition
- `src/` - Source code
  - `generated/` - Generated TypeScript definitions from .proto files
  - `user/` - User service implementation
  - `product/` - Product service implementation
  - `client/` - gRPC client examples
  - `main.ts` - Application entry point
  - `app.module.ts` - Main application module

## Dashboard

The application includes a gRPC dashboard that provides monitoring and debugging capabilities:

- Access the dashboard info at: `http://localhost:3000/grpc-dashboard/api/info`
- Explore available services at: `http://localhost:3000/grpc-dashboard/api/services`
- View logs at: `http://localhost:3000/grpc-dashboard/api/logs`
- Check connections at: `http://localhost:3000/grpc-dashboard/api/connections`
- Monitor request stats at: `http://localhost:3000/grpc-dashboard/api/stats`

## Testing the gRPC Services

The repository includes a `ClientService` that demonstrates how to use the gRPC clients to call the services. This service is automatically executed when the application starts, showing examples of:

1. Getting a user with trace ID metadata
2. Listing products with category filter
3. Creating a product with authentication metadata
4. Subscribing to price updates

You can also use tools like [BloomRPC](https://github.com/uw-labs/bloomrpc) or [gRPCurl](https://github.com/fullstorydev/grpcurl) to test the gRPC services directly.

## Key Files

- `src/app.module.ts` - Main module configuration including GrpcModule and DashboardModule setup
- `src/user/user.controller.ts` - Example of a gRPC controller with service decorators
- `src/client/client.service.ts` - Example of gRPC client usage

## Documentation

For more information about the `nestjs-grpc` package and its features, refer to the official documentation:

- [nestjs-grpc Documentation](https://github.com/your-repo/nestjs-grpc)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [gRPC Documentation](https://grpc.io/docs/)

## License

[MIT](LICENSE)