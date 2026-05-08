const inMemoryStore = new Map();

let redisConnected = false;

async function connectRedis() {
    if (process.env.REDIS_URL) {
        redisConnected = true;
        console.log('Redis mode enabled via REDIS_URL (using local fallback store in this environment)');
        return;
    }

    redisConnected = false;
    console.log('Redis not configured, using local fallback store for like counters');
}

function getRedisClient() {
    return {
        async get(key) {
            const data = inMemoryStore.get(key);
            if (!data) return null;

            if (data.expiresAt && data.expiresAt < Date.now()) {
                inMemoryStore.delete(key);
                return null;
            }

            return String(data.value);
        },
        async set(key, value, mode, ttlSeconds) {
            const ttl = mode === 'EX' ? Number(ttlSeconds) : null;
            inMemoryStore.set(key, {
                value: Number(value),
                expiresAt: ttl ? Date.now() + (ttl * 1000) : null
            });
        },
        async incrby(key, delta) {
            const prev = await this.get(key);
            const nextValue = Number(prev || 0) + Number(delta);
            inMemoryStore.set(key, {
                value: nextValue,
                expiresAt: null
            });
            return nextValue;
        },
        async expire(key, ttlSeconds) {
            const data = inMemoryStore.get(key);
            if (!data) return;
            inMemoryStore.set(key, {
                ...data,
                expiresAt: Date.now() + (Number(ttlSeconds) * 1000)
            });
        }
    };
}

function isRedisReady() {
    return redisConnected || !process.env.REDIS_URL;
}

module.exports = {
    connectRedis,
    getRedisClient,
    isRedisReady
};
