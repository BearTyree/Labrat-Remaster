import express from 'express';
import bodyParser from 'body-parser';
const app = express();
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

import Class from './Models/Class';
new Class({
  name: 'Test Class',
  code: 'test',
}).save();

import authRoutes from './Routes/authRoutes';
app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
