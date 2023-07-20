import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  membership: boolean;
  admin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, maxLength: 50 },
    firstName: { type: String, required: true, maxLength: 50 },
    lastName: { type: String, required: true, maxLength: 50 },
    email: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true },
    membership: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
