type AdminType = {
  username: string;
  starterPassword: string;
};

type SchoolType = {
  name: string;
  phoneNumber: string;
  address: string;
  SRC: SRCType;
};

type SRCType = {
  email: string;
  starterPassword: string;
};

// import modules
import { randomBytes, createHash } from 'crypto';
import config from 'config';
const appConfig = config;

// import models
import Admin from './Models/Admin';
import School from './Models/School';
import SRC from './Models/SRC';

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

const createAdmin = async (username: string, password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(salt + password)
    .digest('hex');
  new Admin({
    username: username,
    password: {
      salt,
      hash,
    },
    hasSetPassword: false,
  }).save();
  console.log(`Admin ${username} created`);
};

const createSchool = async (
  name: string,
  phoneNumber: string,
  address: string,
  schoolSRC: SRCType
) => {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(salt + schoolSRC.starterPassword)
    .digest('hex');

  let newSRC = await new SRC({
    email: schoolSRC.email,
    password: {
      salt,
      hash,
    },
    hasSetPassword: false,
  }).save();

  new School({
    name: name,
    phoneNumber: phoneNumber,
    address: address,
    SRC: newSRC,
  }).save();
  console.log(`School ${name} created`);
};

const setup = async () => {
  let adminLength = await Admin.find();
  if (adminLength.length > 0) {
    console.log('setup already done');
    process.exit(0);
  }

  const admins: AdminType[] = appConfig.get('admins');
  for (const admin of admins) {
    await createAdmin(admin.username, admin.starterPassword);
  }

  const schools: SchoolType[] = appConfig.get('schools');
  for (const school of schools) {
    await createSchool(
      school.name,
      school.phoneNumber,
      school.address,
      school.SRC
    );
  }

  process.exit(0);
};

setup();
