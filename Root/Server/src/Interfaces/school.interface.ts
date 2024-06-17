import { Document, Types } from 'mongoose';

export default interface ISchool extends Document {
  name: String;
  phoneNumber: String;
  address: String;
  SRC: Types.ObjectId;
}
