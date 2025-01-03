import express from 'express'; // Import express
import cors from 'cors'; // Import CORS
import useRouter from './routes/user.router.js'; // Import your user router

const app = express(); 

app.use(cors({
  origin: process.env.CORS || '*', 
}));

app.use(express.json({ limit: '24kb' }));

app.use(express.urlencoded({ limit: '23kb', extended: true }));

app.use(express.static('public'));

app.use('/app/v1/users', useRouter); 

export default app; 
