import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // For CLI operations like db push, directUrl is often more stable
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
