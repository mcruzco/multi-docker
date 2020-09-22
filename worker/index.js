const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();


sub.subscribe('insert');

sub.on('connect', () => {
    console.log("Redis client connected");
});

sub.on('error', (err) => {
    console.log('Something went wrong' + err);
});

function fib(index){
    
    if(index < 2) return 1;

    
    return fib(index - 1) + fib(index - 2);
}

sub.on('message',(channel,message)=>{

    let res = fib(parseInt(message));

    

    console.log(res);
    redisClient.hset('values', message, res, (err,response)=>{
        if (err){
            console.log({"level":"error","message":JSON.stringify(err)});
        }
    });
    
    
});

