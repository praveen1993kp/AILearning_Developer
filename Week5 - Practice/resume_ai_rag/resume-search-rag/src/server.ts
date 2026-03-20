import app from './app';
import config from './config';
import { connectToMongo } from './config/mongo';

const PORT = Number(config.PORT) || 3000;

async function start() {
    try {
        await connectToMongo();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start application:', err);
        process.exit(1);
    }
}

start();