import { Schema, model } from 'mongoose';

interface IMessage {
  title: string;
  body: string;
  user: Schema.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>(
  {
    title: { type: String, required: true, maxLength: 100 },
    body: { type: String, required: true, maxLength: 500 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Message = model<IMessage>('Message', messageSchema);

export default Message;
