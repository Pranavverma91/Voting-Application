const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");

router.post("/signup", async (req, res) => {
    try {
        const data = req.body;
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
        const { aadharCardNumber, dateOfBirth } = req.body;
        const userData = await User.findOne({ aadharCardNumber: aadharCardNumber });

        if (!userData || !(await userData.comparePassword(dateOfBirth))) {
            return res.status(401).json({ error: "Invalid aadharCardNumber or dateOfBirth"});
        }
        const payload = {
            id: userData.id
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

router.put("/profile/dateOfBirth ",jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user;
        const {currentDateOfBirth, newDateOfBirth} = req.body;

        const user = await user.findById(userId);
        
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: `Invalid ${currentDateOfBirth}` });
        }
        
        user.password = newDateOfBirth;
        await user.save();

        console.log("DateOfBirth Updated");
        res.status(200).json({message: "DateOfBirth Updated"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;