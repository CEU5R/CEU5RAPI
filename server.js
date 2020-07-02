const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const ErrorResponse = require("./utils/errorResponse");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route files
const reports = require("./routes/report");
const repairs = require("./routes/repair");
const recommends = require("./routes/recommend");
const recognize = require("./routes/recognize");
const react = require("./routes/react");
const auth = require("./routes/auth");
const users = require("./routes/users");
const history = require("./routes/history");
const department = require("./routes/department");
const building = require("./routes/building");

const app = express();

// Body parser
app.use(express.json());

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ID,
  region: process.env.AWS_REGION,
});

var s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new ErrorResponse(`Please upload a valid image`, 404), false);
  }
};

app.use(
  multer({
    fileFilter,
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: process.env.AWS_S3_ACL,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: "test" });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + ".jpeg");
      },
    }),
  }).single("image")
);

// Cookie parse
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/report", reports);
app.use("/api/v1/repair", repairs);
app.use("/api/v1/recommend", recommends);
app.use("/api/v1/recognize", recognize);
app.use("/api/v1/react", react);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/history", history);
app.use("/api/v1/department", department);
app.use("/api/v1/building", building);

// router for healthCheck
app.use("/healthcheck", require("./routes/healthCheck"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
