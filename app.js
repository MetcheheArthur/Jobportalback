const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors');

// import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobTypeRoute = require('./routes/jobsTypeRoutes');
const jobRoute = require('./routes/jobsRoutes');

const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

//database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));

//MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cookieParser());
app.use(cors());

//ROUTES MIDDLEWARE
//app.get('/', (req, res) => {
  //  res.send("Hello from Node Js");
//})

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', jobTypeRoute);
app.use('/api', jobRoute);

//ROUTES API
// app.get('/api', (req, res) => {
    // Return a response for /api endpoint
  //  res.send('Hello from API!');
// });

// error middleware
app.use(errorHandler);

//port
const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// get all jobs
const Job = mongoose.model("Job");

app.get("/api/jobs", (req, res) => {
  const page = req.query.page;

  Job.find({}, (err, jobs) => {
    if (err) {
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).json({
        success: true,
        jobs: jobs,
        page: page,
        pages: Math.ceil(jobs.length / 10),
        count: jobs.length
      });
    }
  });
});