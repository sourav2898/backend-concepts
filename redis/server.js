const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listener
client.on("error", (err) => {
  console.log("Reddis client error occured: ", err);
});

async function testRedisConnection() {
  try {
    await client.connect();
    console.log("Connection to reddis established");

    await client.set("key", "value");
    const extractValue = await client.get("key");

    console.log({ extractValue });

    const deletedKey = await client.del("key");
    console.log({ deletedKey });

    await client.set("count", 1);

    const incrementCount = await client.incr("count");
    console.log({ incrementCount });

    const decrementCount = await client.decr("count");
    console.log({ decrementCount });
  } catch (error) {
    console.error("Error while connecting reddis: ", error);
  } finally {
    client.quit();
  }
}

testRedisConnection();
