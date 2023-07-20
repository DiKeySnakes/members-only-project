import { Schema, model } from 'mongoose';
const messageSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    body: { type: String, required: true, maxLength: 500 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const Message = model('Message', messageSchema);
export default Message;
