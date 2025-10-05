require("dotenv").config();
const express = require("express");
const { configureCors } = require("./config/corsConfig");
const {
  requestLogger,
  addTimestamp,
} = require("./middleware/customMiddleware");
const { ErrorHandler } = require("./middleware/errorHandler");
const { urlVersioning } = require("./middleware/apiVersioning");
const { createRateLimiter } = require("./middleware/rateLimiting");

const app = express();
const PORT = process.env.PORT || 3000;

// express json middleware
app.use(requestLogger);
app.use(addTimestamp);

app.use(configureCors());
app.use(createRateLimiter(100, 15 * 60 * 1000)); // 100 requests per 15 min
app.use(express.json());

app.use(urlVersioning("v1"));

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
