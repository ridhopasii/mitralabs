const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const bookings = await prisma.$queryRaw`SELECT id, customer_name FROM "Booking" LIMIT 1`;
    console.log("Bookings:", bookings);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
