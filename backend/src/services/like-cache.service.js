const { getRedisClient, isRedisReady } = require('./redis.client');

const LIKE_KEY_PREFIX = 'food:likes:';

function getLikeKey(foodId) {
    return `${LIKE_KEY_PREFIX}${foodId}`;
}

async function readLikeCount(foodId) {
    if (!isRedisReady()) {
        return null;
    }

    try {
        const redis = getRedisClient();
        const value = await redis.get(getLikeKey(foodId));

        if (value === null) {
            return null;
        }

        return Number(value);
    } catch (error) {
        console.error('Failed to read like count from redis:', error.message);
        return null;
    }
}

async function cacheLikeCount(foodId, count) {
    if (!isRedisReady()) {
        return;
    }

    try {
        const redis = getRedisClient();
        await redis.set(getLikeKey(foodId), count, 'EX', 60 * 15);
    } catch (error) {
        console.error('Failed to cache like count:', error.message);
    }
}

async function incrementLikeCount(foodId, delta) {
    if (!isRedisReady()) {
        return null;
    }

    try {
        const redis = getRedisClient();
        const key = getLikeKey(foodId);
        const nextCount = await redis.incrby(key, delta);

        if (nextCount < 0) {
            await redis.set(key, 0, 'EX', 60 * 15);
            return 0;
        }

        await redis.expire(key, 60 * 15);
        return nextCount;
    } catch (error) {
        console.error('Failed to increment like count in redis:', error.message);
        return null;
    }
}

module.exports = {
    readLikeCount,
    cacheLikeCount,
    incrementLikeCount
};
