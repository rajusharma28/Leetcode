import { createClient }  from 'redis';

const redisClient = createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

export default redisClient;