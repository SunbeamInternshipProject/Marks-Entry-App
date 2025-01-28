const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const config = require("../config");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", (request, response) => {
    console.log("*: INside student register");
    console.log(": ", request.body);
    const { rollNo, studentName, email, password, courseName } = request.body;
    console.log("*: ", rollNo, studentName, email, password, courseName);
  
    // Getting course Id from course name
    var cid = 0;
    const statement1 = `select course_id from courses where course_name=?`;
    db.execute(statement1, [courseName], (error, result) => {
      console.log("Register cid result: ", result);
      if (!error) {
        cid = result[0];
        console.log("# ",cid);
        console.log("Course_id is: ", cid["course_id"]);
        const statement = `INSERT INTO students 
      (roll_number, student_name, course_id, email, password)
      VALUES (?, ?, ?, ?, ?)`;
  
        // encrypt the password
        const encryptedPassword = String(crypto.SHA256(password));
  
        db.execute(
          statement,
          [rollNo, studentName, cid["course_id"], email, encryptedPassword],
          (error, result) => {
            response.send(utils.createResponse(error, result));
          }
        );
      }
    });
  });

// LOGIN API
router.post("/login", (request, response) => {
  // Destructuring email and password from the request body
  const { email, password } = request.body;

  console.log("email + password ", email, password);

  const statement = `SELECT student_id, roll_number, student_name, email 
      FROM students 
      WHERE email = ? AND password = ?`;

  console.log("statement ", statement);

  // Encrypting the provided
  const encryptedPassword = String(crypto.SHA256(password));

  // Executing the SQL query with user-provided email and encrypted password
  db.execute(statement, [email, encryptedPassword], (error, users) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      if (users.length === 0) {
        response.send(utils.createErrorResponse("user not found!"));
      } else {
        const student = users[0];
        console.log("After response from mysql: ", student);

        // Creating a payload with user information for JWT token
        const payload = {
          student_id: student["student_id"],
          email: student["email"],
          roll_number: student["roll_number"],
          student_name: student["student_name"],
          role: "student",
        };

        console.log("Check Student payload ", payload);

        // Generating a JWT token with the payload and a secret key
        const token = jwt.sign(payload, config.SECRET_KEY, { expiresIn: "1h" });
        console.log("JWT Token is : "+token);
        response.send(
          utils.createSuccessResponse({
            token,
            // username: user["username"], or
            student_name: student.student_name,
          })
        );
      }
    }
  });
});









  module.exports = router;
