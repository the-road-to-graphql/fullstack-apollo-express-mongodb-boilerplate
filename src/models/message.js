import mongoose from 'mongoose';

const Message = mongoose.model(
  'Message',
  new mongoose.Schema(
    {
      text: {
        type: String,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Message',
        },
      ],
    },
    {
      timestamps: true,
    },
  ),
);
export default Message;
