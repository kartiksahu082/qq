import express from "express";
import cors from 'cors';

const app = express();
app.use(cors());  // CORS configuration
app.use(express.json());  // Parse incoming JSON requests

const port = process.env.PORT || 3000;

// Quote endpoint returning a list of quotes
app.get('/quote', (req, res) => {
    const quote = [
        {
            "text": "The only way to do great work is to love what you do.",
            "author": "Steve Jobs"
        },
        {
            "text": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            "author": "Winston Churchill"
        },
        {
            "text": "Believe you can and you're halfway there.",
            "author": "Theodore Roosevelt"
        },
        {
            "text": "It does not matter how slowly you go as long as you do not stop.",
            "author": "Confucius"
        },
        {
            "text": "Life is what happens when you're busy making other plans.",
            "author": "John Lennon"
        },
        {
            "text": "In the end, we will remember not the words of our enemies, but the silence of our friends.",
            "author": "Martin Luther King Jr."
        },
        {
            "text": "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
            "author": "Ralph Waldo Emerson"
        },
        {
            "text": "It is never too late to be what you might have been.",
            "author": "George Eliot"
        },
        {
            "text": "You miss 100% of the shots you don’t take.",
            "author": "Wayne Gretzky"
        },
        {
            "text": "The best way to predict your future is to create it.",
            "author": "Abraham Lincoln"
        }
    ];
    
    // Sending the quote array as a response with status code 200 (OK)
    res.status(200).send(quote);
});

// Default home route
app.get('/', (req, res) => {
    res.status(200).send('Hello!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
