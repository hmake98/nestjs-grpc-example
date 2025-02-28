import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { UserService } from "./user/user.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  // Example usage
  const userService = app.get(UserService);

  console.log("Creating a user...");
  const newUser = await userService.create({
    name: "John Doe",
    age: 30,
    email: "john@example.com",
  });
  console.log("User created:", newUser);

  console.log("Getting all users...");
  const allUsers = await userService.findAll({});
  console.log("All users:", allUsers);

  console.log("Getting user by ID...");
  const user = await userService.findOne({
    id: newUser.id,
  });
  console.log("Found user:", user);
}
bootstrap();
