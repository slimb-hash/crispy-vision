import mongoose from 'mongoose';

// Mêmes valeurs que les <option> de booking.html
export const SERVICES = [
  'Game Day Highlights',
  'Event Coverage',
  'Player Mixtape',
  'Tournament Coverage',
  'Social Media Content',
  'Athlete Feature / Mini-Doc',
];
export const SPORTS = ['Basketball', 'Soccer', 'Other'];
export const STATUSES = ['pending', 'accepted', 'declined'];

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 25 },
    service: { type: String, required: true, enum: SERVICES },
    sport: { type: String, required: true, enum: SPORTS },
    eventDate: { type: Date },
    location: { type: String, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: STATUSES, default: 'pending', index: true },
    adminNote: { type: String, trim: true, maxlength: 1000, default: '' },
  },
  { timestamps: true } // ajoute createdAt et updatedAt automatiquement
);

reservationSchema.index({ createdAt: -1 });

export const Reservation = mongoose.model('Reservation', reservationSchema);
