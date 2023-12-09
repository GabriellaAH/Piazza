const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },  
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    default: () => {
        const now = new Date();
        now.setDate(now.getDate() + 30);
        return now;
      },
    require: true
  }
});

module.exports = mongoose.model('Post', PostSchema);
