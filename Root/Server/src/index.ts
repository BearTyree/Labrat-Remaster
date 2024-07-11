import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

import { Server } from 'socket.io';

import Student from './Models/Student';
import Teacher from './Models/Teacher';

const app = express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// connect to database
import mongoose, { set } from 'mongoose';
const url = process.env.DATABASE_URL;
const connect = async () => {
  try {
    await mongoose.connect(url, { dbName: 'LabRatRemaster' });
    console.log('connected to database');
  } catch (err) {
    console.log(err.message);
    // try to connect again after 5 seconds
    setTimeout(connect, 5000);
  }
};
connect();

import authRoutes from './Routes/authRoutes';
app.use(authRoutes);
import projectRoutes from './Routes/projectRoutes';
app.use(projectRoutes);
import teacherRoutes from './Routes/teacherRoutes';
app.use(teacherRoutes);
import srcRoutes from './Routes/srcRoutes';
app.use(srcRoutes);
import classRoutes from './Routes/classRoutes';
import Project from './Models/Project';
import { authenticateToken, getUserType } from './Controllers/authController';
import SRC from './Models/SRC';
app.use(classRoutes);

// import Class from './Models/Class';

// new Class({
//   code: 'test',
//   name: 'test',
// }).save();

// Project.watch().on('change', () => {
//   console.log('asdfdfsa');
// });

io.on('connection', (socket) => {
  socket.on('token', async (token) => {
    const verified = await authenticateToken(token);
    const userType = await getUserType(verified.email);

    let id: string;
    switch (userType) {
      case 'SRC':
        const srcUser = await SRC.findOne({ email: verified.email }).catch(
          (err) => console.log(err)
        );
        if (srcUser) {
          id = srcUser._id.toString();
        } else {
          console.log('error');
        }
        break;
      case 'student':
        const studentUser = await Student.findOne({
          email: verified.email,
        }).catch((err) => console.log(err));
        if (studentUser) {
          id = studentUser._id.toString();
        } else {
          console.log('error');
        }
        break;
      case 'Teacher':
        const teacherUser = await Teacher.findOne({
          email: verified.email,
        }).catch((err) => console.log(err));
        if (teacherUser) {
          id = teacherUser._id.toString();
        } else {
          console.log('error');
        }
        break;
    }
    socket.join(id.toString());
  });
});

const sendUpdateToUser = (id, data) => {
  // io.to(connections[id]).emit('update', { project: data });
  io.to(id.toString()).emit('update', { project: data });
};

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export { sendUpdateToUser };
