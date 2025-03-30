import { User, UserRole } from "../generated/user";

// In-memory database for users
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Sample users for the demo
export const users: UserData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: UserRole.ADMIN,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: UserRole.USER,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: UserRole.MODERATOR,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
