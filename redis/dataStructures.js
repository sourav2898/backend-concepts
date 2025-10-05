const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

// event listener
client.on("error", (err) => {
  console.log("Reddis client error occured: ", err);
});

async function redisDatraStructure() {
  try {
    await client.connect();
    // Strings -> SET, GET, MSET, MGET
    await client.set("user:name", "Sourav");
    const name = await client.get("user:name");

    await client.mSet([
      "user:email",
      "sourav@gmail.com",
      "user:age",
      "27",
      "user:country",
      "India",
    ]);

    const [email, age, country] = await client.mGet([
      "user:email",
      "user:age",
      "user:country",
    ]);
    console.log({ email, age, country });

    // list -> LPUSH, RPUSH, LRANGE, LPOP, RPOP
    await client.lPush("notes", ["Note 1", "Note 2", "Note 3"]);
    const firstNote = await client.lPop("notes");
    console.log({ firstNote });

    const extractedNotes = await client.lRange("notes", 0, -1);
    console.log({ extractedNotes });

    // sets -> SADD, SMEMBERS, SISMEMBER, SREM
    await client.sAdd("user:nickNames", ["sourav", "kumar", "dubey"]);
    const nickNames = await client.sMembers("user:nickNames");
    console.log({ nickNames });

    const isSKDPresent = await client.sIsMember("user:nickNames", "skd");
    console.log({ isSKDPresent });

    await client.sRem("user:nickNames", "kumar");
    const updatedNickNames = await client.sMembers("user:nickNames");
    console.log({ updatedNickNames });

    // sorted sets -> userfull for leaderboard or priority queues, ZADD, ZRANGE, ZRANK, ZREM
    await client.zAdd("cart", [
      {
        score: 100,
        value: "Cart 2",
      },
      {
        score: 150,
        value: "Cart 3",
      },
      {
        score: 10,
        value: "Cart 1",
      },
    ]);

    const getCartItems = await client.zRange("cart", 0, -1);
    console.log({ getCartItems });

    const getCartItemRank = await client.zRank("cart", "Cart 2");
    console.log({ getCartItemRank });

    const getCartItemsWithRank = await client.zRangeWithScores("cart", 0, -1);
    console.log({ getCartItemsWithRank });

    // hashes -> hSet, hGet, hGetAll, hDel
    await client.hSet("product:1", {
      name: "Product 1",
      desc: "Prodcut 1 description",
      rank: 5,
    });
    const getProdcutRank = await client.hGet("product:1", "rank");
    console.log({ getProdcutRank });
    const getProductDetails = await client.hGetAll("product:1");
    console.log(getProductDetails);

    await client.hDel("product:1", "rank");
    const updatedProducts = await client.hGetAll("product:1");
    console.log(updatedProducts);
  } catch (error) {
    console.error("Error while reading the redis data structure: ", error);
  } finally {
    client.quit();
  }
}

redisDatraStructure();
