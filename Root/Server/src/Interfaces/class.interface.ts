import { Document, Types } from 'mongoose';

export default interface IClass extends Document {
  name: String;
  code: String;
  teacher: Types.ObjectId;
}
