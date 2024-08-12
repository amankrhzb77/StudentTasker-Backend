const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const EmployeeModel = require('./models/Employee.js');
const AdminModel = require('./models/Admin.js'); // Import the Admin model

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/studentTasker");

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    EmployeeModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Login Successfully");
                } else {
                    res.json("Incorrect Password");
                }
            } else {
                res.json("No record found");
            }
        })
});

app.post('/register', (req, res) => {
    EmployeeModel.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => res.json(err));
});

// Admin login route
app.post('/admin-login', (req, res) => {
    const { adminId, password } = req.body;

    AdminModel.findOne({ adminId })
        .then(admin => {
            if (admin) {
                if (admin.password === password) {
                    res.json("Success"); // If credentials match
                } else {
                    res.json("Invalid credentials");
                }
            } else {
                res.json("Admin not found");
            }
        })
        .catch(err => res.status(500).json("Server error"));
});

app.get('/student-details', (req, res) => {
   // Adjust this logic to fetch the correct student's data
   EmployeeModel.findOne({ email: req.query.email }) // Assuming you're fetching by email
       .then(student => {
           if (student) {
               res.json({ name: student.name, email: student.email });
           } else {
               res.status(404).json('Student not found');
           }
       })
       .catch(err => res.status(500).json('Server error'));
});

app.get('/get-students', (req, res) => {
   EmployeeModel.find({})
       .then(students => res.json(students))
       .catch(err => res.status(500).json("Server error"));
});

app.post('/assign-task', (req, res) => {
   const { studentId, task } = req.body;
   // Here, you can implement the logic to assign the task to the student
   // For now, we just send a success response
   res.json("Task assigned successfully");
});


app.listen(3001, () => {
    console.log("Server is running");
});
