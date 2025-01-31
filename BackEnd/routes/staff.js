const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const config = require("../config");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", (request, response) => {
  console.log("*: INside staff register");
  console.log(": ", request.body);
  const { empNo, empName, email, password, course_name } = request.body;
  console.log("***: ", empNo, empName, email, password, course_name);
  const role="staff";

  
      const statement = `INSERT INTO staff 
    (employee_number, staff_name, email, password, role, course_name )
    VALUES (?, ?, ?, ?, ?, ?)`;

      // encrypt the password
      const encryptedPassword = String(crypto.SHA256(password));

      db.execute(
        statement,
        [empNo, empName, email, encryptedPassword, role, course_name],
        (error, result) => {
          response.send(utils.createResponse(error, result));
        }
      );
    }
  
);

// LOGIN API
router.post("/Login", (request, response) => {
  // Destructuring email and password from the request body
    const { email, password } = request.body;

    console.log("email + password ", email, password);

    const statement = `SELECT* FROM staff WHERE email = ? AND password = ?`;

    console.log("statement ", statement);

  // Encrypting the provided
   // const encryptedPassword = String(crypto.SHA256(password));

  // Executing the SQL query with user-provided email and encrypted password
    db.execute(statement, [email, password], (error, users) => {
    if (error) {
        response.send(utils.createErrorResponse(error));
    } else {
      if (users.length === 0) {
        response.send(utils.createErrorResponse("user not found!"));
      } else {
        const staff = users[0];
        console.log("After response from mysql: ", staff);

        // Creating a payload with user information for JWT token
        const payload = {
        staff_id: staff["staff_id"],
        email: staff["email"],
        employee_number: staff["employee_number"],
        staff_name: staff["staff_name"],
        role: staff["role"],
        course_name:staff["course_name"]
        };

        console.log("Check Student payload ", payload);

        // Generating a JWT token with the payload and a secret key
        const token = jwt.sign(payload, config.SECRET_KEY, { expiresIn: "1h" });
        console.log("JWT Token is : "+token);
        response.send(
          utils.createSuccessResponse({
            token,
            // username: user["username"], or
            staff_name: staff.staff_name,
          })
        );
      }
    }
  });
});









  module.exports = router;
