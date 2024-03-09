const secretKey='3036f07992791a5b5f76b27402e800c75e01e6c0eb72266c91f1a8cedf87cfd99e0280a17dc583c2456675229a639ba0df602ee962ebf5a37126ced2efb27b3f'; // Replace with your actual secret key
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

mongoose.connect('mongodb://127.0.0.1:27017/chatapp');

app.use(cors());
app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const loggedInUserEmail = req.body.email;
    const users = await User.find({ email: { $ne: loggedInUserEmail } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "No user found" });
    }
    if (!password) {
      return res.json({ error: "Type password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(200).send({ error: "Passwords don't match" });
    }
    if (passwordMatch) {
      const token = await jwt.sign({ email }, secretKey, { expiresIn: "7d" });

      console.log(user);
      return res.status(200).send({ success: true, message: "Login success", user, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in Login", error });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('authToken');
  localStorage.removeItem('user');
  res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/Profile', (req, res) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.put('/profile/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;

  try {
    const result = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await User.findByIdAndDelete(userId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.get('/messages', async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 }); // Sort messages by timestamp in ascending order

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log('message received:', message);
    io.emit('message', message);

    const { senderId, receiverId, content } = message;
    const newMessage = new Message({
      senderId,
      receiverId,
      content
    });
    newMessage.save();
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
