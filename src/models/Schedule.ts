import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  slots: {
    time: string;
    activity: string;
    type: 'study' | 'routine' | 'break';
    color: string;
  }[];
}

const ScheduleSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  slots: [
    {
      time: { type: String, required: true },
      activity: { type: String, required: true },
      type: { type: String, enum: ['study', 'routine', 'break'], required: true },
      color: { type: String, default: 'blue' }
    }
  ]
}, { timestamps: true });

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);