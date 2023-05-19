import Login from "../models/login.models.js";
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Parse JSON bodies
app.use(bodyParser.json());

export const authenticateUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(username," ",password," body")
    // Find the user by username
    try {
        const user = await Login.findOne({ username });
        if (!user) {
          console.log('User not found');
          return res.status(401).json({ message: 'Invalid username' });
        }
      
        if (user.password === password) {
          console.log('Authentication successful');
          return res.status(200).json({ message: 'Authentication successful' });
          // Perform further actions for an authenticated user
        } else {
          console.log('Invalid password');
          return res.status(401).json({ message: 'Invalid password' });
        }
      } catch (error) {
        console.log('Error finding user:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
};
