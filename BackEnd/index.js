const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const utils = require("./utils");
const config = require("./config");
const jwt = require("jsonwebtoken");

const port = config.PORT_NO;

console.log(port);

// create a new express application
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.get("/version", (req, res) => res.send(utils.createSuccessResponse("1.0")));



//configure ptotected routes
app.use((request, response, next) => {
    const skipUrls = [
        "/student/login",
        "/student/register",
        "/staff/Login",
        "/staff/register"
      ];

      if (skipUrls.includes(request.url)) {
        // If the request URL is in skipUrls, skip token verification
        console.log(request.body);
        next();
      }

      

});

const studentRoutes = require("./routes/student");

app.use("/student", studentRoutes);
const staffRoutes = require("./routes/staff");

app.use("/staff", staffRoutes);





app.listen(port, () => console.log(`App listening on port ${port}!`));