import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser'
import connectDb from './db/index.js'
import dotenv from 'dotenv';
import useRouter from "./routes/user.router.js";

const app = express();
app.use(cors());  // CORS configuration
app.use(express.json());  // Parse incoming JSON requests
dotenv.config();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDb();

// Quote endpoint returning a list of quotes

// Default home route
app.get('/', (req, res) => {
    res.status(200).send('Hello!');
});

app.use('/app/v1/users', useRouter); 

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
