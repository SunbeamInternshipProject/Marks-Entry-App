const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const config = require("../config");
const crypto = require("crypto-js");

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







  module.exports = router;
