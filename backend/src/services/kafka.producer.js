let kafkaConnected = false;

async function connectKafkaProducer() {
    kafkaConnected = Boolean(process.env.KAFKA_BROKERS);

    if (kafkaConnected) {
        console.log('Kafka mode enabled via KAFKA_BROKERS (using HTTP bridge in this environment)');
        return;
    }

    console.log('Kafka not configured, like events will be logged only');
}

async function publishLikeEvent(payload) {
    if (!kafkaConnected) {
        console.log('Like event (local):', payload);
        return;
    }

    const bridgeUrl = process.env.KAFKA_EVENTS_BRIDGE_URL;

    if (!bridgeUrl) {
        console.log('Like event (kafka bridge missing):', payload);
        return;
    }

    try {
        await fetch(bridgeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: process.env.KAFKA_LIKES_TOPIC || 'food-like-events',
                key: String(payload.foodId),
                value: payload
            })
        });
    } catch (error) {
        console.error('Failed to send event to kafka bridge:', error.message);
    }
}

module.exports = {
    connectKafkaProducer,
    publishLikeEvent
};
