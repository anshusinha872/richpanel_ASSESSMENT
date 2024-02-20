const cache = require('memory-cache');

const getCacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = cache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    }
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    next();
  };
};

const addToCache = (key, data) => {
    console.log('addToCache_key', key);
    console.log('addToCache_data', data);
  cache.put(key, data);
};

const removeFromCache = (key) => {
    console.log('removeFromCache_key', key);
  cache.del(key);
};

module.exports = {
  cache,
  getCacheMiddleware,
  addToCache,
  removeFromCache,
};
