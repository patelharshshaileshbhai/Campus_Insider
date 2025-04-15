// import express from 'express'
// import dotenv from 'dotenv'
// dotenv.config();
// import authRoutes from './routes/auth.route'
// import reviewRoutes from './routes/review.route'
// import dataRoutes from './routes/data.route'


// const app: express.Application = express();

// const port=process.env.PORT || 3000;


// app.use(express.json());

// // app.use(errorHandler)
// app.use('/api/auth',authRoutes)
// app.use('/api/review',reviewRoutes)
// app.use('/api/data',dataRoutes)

// app.get('/',(req,res)=>{
//     res.send('Hello World')
// })

// app.listen(port,()=>{
//     console.log(`Server is running on port ${port}`)
// })



// index.ts (or your main server file)
import express from 'express';
import dotenv from 'dotenv';
import prisma, { connectDB } from './config/prisma'; // Adjust path as needed
import authRoutes from './routes/auth.route';
import reviewRoutes from './routes/review.route';
import dataRoutes from './routes/data.route';
import reelRoute from './routes/reel.route'
import cors from 'cors';
dotenv.config();


const app: express.Application = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/reel', reelRoute); // Add this line to include the reel route

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start server with DB connection
async function startServer() {
    try {
        await connectDB();
        
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        // Graceful shutdown handling
        process.on('SIGTERM', shutDown);
        process.on('SIGINT', shutDown);
    } catch (error) {
        console.error('Server startup error:', error);
    }
}

// Graceful shutdown function
async function shutDown() {
    try {
        await prisma.$disconnect();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
}

startServer();