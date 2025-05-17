import { PrismaClient } from '../../generated/prisma';
import bcrypt from "bcryptjs";

const prisma: PrismaClient = new PrismaClient();

async function main() {

  // Seed user account
  const password = await bcrypt.hash("Password1234", 10);
  await prisma.user.createMany({
    data: [
      {
        name: "Muhammad Naufan Athoillah",
        email: "naufan@example.com",
        password,
        is_verified: true,
        role: "admin"
      },
      {
        name: "John Doe",
        email: "jhon@example.com",
        password,
        is_verified: true,
        role: "admin"
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        password,
        is_verified: true,
        role: "admin"
      },
      {
        name: "Mark Doe",
        email: "mark@example.com",
        password,
        is_verified: true,
        role: "verifikator"
      },
      {
        name: "Martin Doe",
        email: "martin@example.com",
        password,
        is_verified: true,
        role: "verifikator"
      },
      {
        name: "Alex Doe",
        email: "alex@example.com",
        password,
        is_verified: true,
        role: "user"
      },
      {
        name: "Bob Doe",
        email: "bob@example.com",
        password,
        is_verified: true,
        role: "user"
      }
    ]
  });

  // Seed leave type
  await prisma.leaveType.createMany({
    data: [
      {
        name: "Sakit"
      },
      {
        name: "Izin"
      },
      {
        name: "Cuti"
      },
    ]
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });