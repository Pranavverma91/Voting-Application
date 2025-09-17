const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");
const { raw }= require("body-parser");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            age: req.body.age,
            mobile: req.body.mobile,
            email: req.body.email,
            address: req.body.address,
            aadharCardNumber: req.body.aadharCardNumber,
            password: req.body.password
        }
        console.log(data);
        const newUser = new User(data);

        const response = await newUser.save();
        console.log("data saved");

        const payload = {
            id: response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is: ", token);

        res.status(201).json({ response: response, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

router.post("/login", async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const userData = await User.findOne({ aadharCardNumber: aadharCardNumber });
        
        if (!userData || !(await userData.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid aadharCardNumber or password"});
        }
        
        const payload = {
            id: userData.id,
            role: userData.role 
        }
        const token = generateToken(payload);
        res.json((token));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("profile", jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/profile/password ", jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const { currentpassword, newpassword } = req.body;

        const user = await user.findById(userId);

        if (!(await user.comparePassword(currentpassword))) {
            return res.status(401).json({ error: `Invalid ${currentpassword}` });
        }

        user.password = newpassword;
        await user.save();

        console.log("Password Updated");
        res.status(200).json({ message: "Password Updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;