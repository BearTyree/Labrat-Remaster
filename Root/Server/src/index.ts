import express from 'express';
import bodyParser from 'body-parser';
const app = express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
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

// import Class from './Models/Class';

// new Class({
//   code: 'test',
//   name: 'test',
// }).save();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
