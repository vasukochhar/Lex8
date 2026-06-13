"""
Lex8 Redpanda/Kafka event bus — Topic config + producer/consumer helpers.
"""

import json
from confluent_kafka import Producer, Consumer
from confluent_kafka.admin import AdminClient, NewTopic


# ── Topic definitions ──
TOPICS = {
    "lex8.actions.created": "Every agent action",
    "lex8.documents.ingested": "New document uploaded (triggers Vault Vision)",
    "lex8.drift.detected": "Model drift alert",
}


def create_topics(broker: str = "localhost:9092"):
    """Create all Lex8 topics in Redpanda."""
    admin = AdminClient({"bootstrap.servers": broker})
    new_topics = [
        NewTopic(name, num_partitions=3, replication_factor=1)
        for name in TOPICS
    ]
    futures = admin.create_topics(new_topics)
    for topic, future in futures.items():
        try:
            future.result()
            print(f"  + Created topic: {topic}")
        except Exception as e:
            if "already exists" in str(e):
                print(f"  = Topic exists: {topic}")
            else:
                print(f"  ! Error creating {topic}: {e}")


def get_producer(broker: str = "localhost:9092") -> Producer:
    """Create a Kafka producer."""
    return Producer({
        "bootstrap.servers": broker,
        "client.id": "lex8-gateway",
        "acks": "all",
    })


def get_consumer(group_id: str, topics: list[str], broker: str = "localhost:9092") -> Consumer:
    """Create a Kafka consumer."""
    consumer = Consumer({
        "bootstrap.servers": broker,
        "group.id": group_id,
        "auto.offset.reset": "earliest",
    })
    consumer.subscribe(topics)
    return consumer


def publish(producer: Producer, topic: str, key: str, payload: dict):
    """Publish a JSON event to a topic."""
    producer.produce(
        topic,
        key=key.encode("utf-8"),
        value=json.dumps(payload).encode("utf-8"),
    )
    producer.flush()


if __name__ == "__main__":
    print("Creating Lex8 Redpanda topics...")
    create_topics()
    print("Done!")
