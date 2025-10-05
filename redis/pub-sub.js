const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listener
client.on("error", (err) => {
  console.log("Reddis client error occured: ", err);
});

async function testPubSub() {
  try {
    await client.connect();
    const subscriber = client.duplicate();
    await subscriber.connect();
    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`Received message ${message} from channel ${channel}`);
    });

    await client.publish("dummy-channel", "Some message fomr the publisher");
    await client.publish(
      "dummy-channel",
      "Some new message fomr the publisher"
    );

    await new Promise((res) => setTimeout(res, 1000));

    await subscriber.unsubscribe("dummy-channel");
    await subscriber.quit();

    // pipelining and transactions
  } catch (error) {
    console.log("Error while connecting to the redis client: ", error);
  } finally {
    client.quit();
  }
}

testPubSub();
