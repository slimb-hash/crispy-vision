import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB déconnecté'));
  mongoose.connection.on('reconnected', () => console.log('🔁 MongoDB reconnecté'));

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`✅ Connecté à MongoDB (base « ${mongoose.connection.name} »)`);
}
