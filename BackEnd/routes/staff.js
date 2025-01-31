const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const config = require("../config");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");


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
