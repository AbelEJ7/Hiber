import Login from "../models/login.models.js";

export const authenticateUser = (req, res) => {
  const { username, password } = req.body;

  Login.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } }, (err, user) => {
    if (err) {
      console.log('Error finding user:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (!user) {
      console.log('User not found');
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (user.password === password) {
      console.log('Authentication successful');
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      console.log('Invalid password');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
};
