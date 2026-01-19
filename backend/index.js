const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Production DB Connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/content", require("./routes/contentRoutes"));

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);
