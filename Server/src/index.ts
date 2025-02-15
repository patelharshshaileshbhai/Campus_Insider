import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import authRoutes from './routes/auth.route'
import reviewRoutes from './routes/review.route'
import dataRoutes from './routes/data.route'


const app: express.Application = express();

const port=process.env.PORT || 3000;


app.use(express.json());

// app.use(errorHandler)
app.use('/api/auth',authRoutes)
app.use('/api/review',reviewRoutes)
app.use('/api/data',dataRoutes)

app.get('/',(req,res)=>{
    res.send('Hello World')
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})