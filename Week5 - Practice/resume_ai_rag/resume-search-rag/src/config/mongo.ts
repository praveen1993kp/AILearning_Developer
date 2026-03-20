import mongoose from 'mongoose';
import config from './index';

export async function connectToMongo(): Promise<void> {
    const uri = config.MONGODB_URI;

    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    try {
        await mongoose.connect(uri, opts);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
}

export async function disconnectMongo(): Promise<void> {
    await mongoose.disconnect();
}

export default mongoose;
