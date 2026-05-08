// start server
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connectRedis } = require('./src/services/redis.client');
const { connectKafkaProducer } = require('./src/services/kafka.producer');
 

// connectDB();
async function startServer(){
    await connectDB();
    await connectRedis();
    await connectKafkaProducer();
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
startServer();