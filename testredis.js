import { createClient } from "redis";

const client = createClient({
  username: "default",
  password: "C746aenEqrH9i3te3MYeFnBnwdHr07jw",
  socket: {
    host: "redis-16604.c81.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 16604,
  },
});

client.on("error", (err) => console.error("Redis error:", err));

async function testRedis() {
  try {
    await client.connect();

    await client.set("foo", "bar");
    const result = await client.get("foo");
    console.log(result);
  } catch (err) {
    console.error("Redis operation failed:", err);
  } finally {
    await client.disconnect();
  }
}

testRedis();
