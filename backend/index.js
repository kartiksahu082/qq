import connectDb from './db/index.js';  // Importing DB connection function
import dotenv from 'dotenv';
import app from './app.js';  // Importing Express app

// Load environment variables
dotenv.config();

// Connect to the database
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server connected on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.log('DB connection failed:', err);
  });

