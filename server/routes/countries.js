const express = require("express");
const { CountryModel, validateCountry } = require("../models/countryModel");
const { userModel } = require("../models/userModel");
const { auth } = require("../middlewares/auth");
const router = express.Router()

router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id"
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await CountryModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }

})

router.post("/", auth, async (req, res) => {
    let validBody = validateCountry(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user_id = req.user._id
        let country = new CountryModel({ ...req.body, user_id });
        await country.save();
        return res.status(201).json(country);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
});

router.put("/:id", auth, async (req, res) => {
    let validBody = validateCountry(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let id = req.params.id;
        let country = await CountryModel.findById(id);
        if (!country) {
            return res.status(404).json({ msg: "Country not found" });
        }
        if (country.user_id.toString() !== req.user._id) {
            return res.status(403).json({ msg: "You are not allowed to update this country" });
        }

        let result = await CountryModel.updateOne({ _id: id }, req.body);
        res.json(result);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "There is a problem try again later", err });
    }
});
router.delete("/:id", auth, async (req, res) => {
    let validBody = validateCountry(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let id = req.params.id;
        let country = await CountryModel.findById(id);
        if (!country) {
            return res.status(404).json({ msg: "Country not found" });
        }
        if (country.user_id.toString() !== req.user._id) {
            return res.status(403).json({ msg: "You are not allowed to delete this country" });
        }
        let data = await CountryModel.deleteOne({_id: id})
        res.json(data);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "There is a problem try again later", err });
    }
});

module.exports = router;

