import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const Login = mongoose.model('users', loginSchema);

export default Login;