import { createClient } from 'redis';
import { envVars } from './envVars';

const redisClient = createClient({
    username: envVars.REDIS_USERNAME,
    password: envVars.REDIS_PASSWORD,
    socket:{
        host: envVars.REDIS_HOST,
        port: Number(envVars.REDIS_PORT),
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));


// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

export const connectRedish=async()=>{
    if (!redisClient.isOpen) {
        await redisClient.connect()
        console.log("redis connect");
        
    }
}

