const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./Routers/userRoutes");
const noteRoutes = require("./Routers/noteRoutes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      allowOrigins: ["*"],
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["*"],
        scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
      },
    },
  }),
);

app.use(express.json());
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

app.use("/api", apiLimiter);

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

app.use("/api", userRoutes);
app.use("/api/notes", noteRoutes);

app.get("*", (req, res) => {
  res.status(404).send("404 error");
});

module.exports = app;
