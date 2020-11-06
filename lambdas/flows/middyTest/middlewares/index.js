const authMiddleware = (config) => {
    // might set default options in config
    return {
      before: (handler, next) => {
        console.log("Auth middleware before", JSON.stringify(handler));
        handler.event.auth = true;
        next();
      },
      after: (handler, next) => {
        console.log("Auth middleware after", JSON.stringify(handler));
        next();
      },
      onError: (handler, next) => {
        console.log("Auth middleware error", JSON.stringify(handler));
        next();
      },
    };
  };
  
  module.exports = { authMiddleware };
  