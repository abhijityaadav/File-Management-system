const express = require('express');
const cors = require('cors');
const { connectionToDatabase } = require('./config/db'); // Correct path to db.js
const fileRoutes = require('./Routes/fileRoutes'); // Ensure this path is correct

const app = express();  // Initialize app here
const PORT = 5005;

// Middleware
app.use(express.urlencoded({ extended: true })); // Add this line after app is initialized
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this if your frontend is running on a different port
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));
  
app.use(express.json());

// Connect to the Database
connectionToDatabase()
  .then(() => {
    console.log('Connected to database successfully!');

    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the process if DB connection fails
  });

// Routes
app.use('/api/files', fileRoutes); // Enable your routes only after DB connection
