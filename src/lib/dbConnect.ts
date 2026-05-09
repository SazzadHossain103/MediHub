import mongoose from 'mongoose';
import { createSuperAdmin } from "./createSuperAdmin";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: 'medihub',
    });

    connection.isConnected = db.connections[0].readyState;

    console.log('Database connected successfully');
    await createSuperAdmin();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

export default dbConnect;