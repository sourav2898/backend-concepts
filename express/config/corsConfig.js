const cors = require("cors");

const configureCors = () => {
  return cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3000"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("Request from unauthorized domains are not allowed")
        );
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Autorization", "Accept-Version"],
    exposedHeaders: ["X-Total-Count"],
    credentials: true, // enable support for cookies; this supports to pass headers,
    preflightContinue: false,
    maxAge: 600, // this will cache your prefilght responses for 10 mins; helps us to avoid sending options request multiple times
    optionsSuccessStatus: 204,
  });
};

module.exports = { configureCors };
