import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  size: Number,
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

export const File = mongoose.model('File', fileSchema); 