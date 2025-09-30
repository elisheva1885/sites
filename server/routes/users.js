const express = require("express");
const bcrypt = require("bcrypt")
const { auth } = require("../middlewares/auth")
const jwt = require("jsonwebtoken");
const { userModel, validateUser, validLogin, createToken } = require("../models/userModel");
const router = express.Router()

router.get("/", (req, res) => {
    res.json({ msg: "user work" })
})


router.post("/", async (req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new userModel(req.body);
        console.log(user)
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();

        user.password = "******"
        res.status(201).json(user)
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })
        }
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})
router.post("/login", async (req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ msg: "Password or email is wrong, code:1" })
        }
        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is wrong, code:2" })
        }
        let newToken = createToken(user._id);
        res.json({ token: newToken })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})

router.get("/myEmail", auth, async(req,res)=>{
    try{
        let user =  await userModel.findOne({
            _id: req.user._id},{email:1})
            res.json(user);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err })
        }
    }
)
router.get("/myInfo", auth, async(req,res)=>{
    try{
        let user =  await userModel.findOne({
            _id: req.user._id},{email:1, name:1})
            res.json(user);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "err", err })
        }
    }
)

module.exports = router;