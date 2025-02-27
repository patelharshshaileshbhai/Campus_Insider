import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectDB() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
}

export default prisma;
export { connectDB };