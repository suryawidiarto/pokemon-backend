const redis = require("redis");

const redisClient = redis.createClient({
  url: `${process.env.REDIS_URI}`,
});

exports.redisCache = async (key, timeExpired, apiCallback) => {
  redisClient.on("error", (err) => {
    console.log("Redis Client Error: ", err);
  });
  await redisClient.connect();

  try {
    const getData = await redisClient.get(key);
    if (getData != null) {
      //getting data from cache
      await redisClient.quit();
      return JSON.parse(getData);
    } else {
      //getting new data from api
      const newData = await apiCallback();
      await redisClient.setEx(key, timeExpired, JSON.stringify(newData));
      await redisClient.quit();
      return newData;
    }
  } catch (err) {
    await redisClient.quit();
    throw Error(err);
  }
};
