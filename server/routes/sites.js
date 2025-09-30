const express = require("express");
const { SiteModel, validateSite } = require("../models/SiteModel");
const router = express.Router()
router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20)|| 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id"
    let reverse = req.query.reverse == "yes"? -1 :1;
    try{
        let data = await SiteModel
        .find({})
        .limit(perPage)
        .skip((page-1) * perPage)
        .sort({[sort]:reverse})
        res.json(data)
      }
      catch(err){
        console.log(err);
        res.status(500).json({msg:"err",err})
      }
    let data = await SiteModel.find({})
    res.status(200).json(data);
})

router.get("/:id", async (req, res) => {
    let site = await SiteModel.findById(req.params.id)
    res.status(200).json(site)
})

router.post("/", async (req, res) => {
    let validBody = validateSite(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let site = new SiteModel(req.body);
        await site.save();
        return res.status(201).json(site);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
});

router.put("/:id", async (req, res) => {
    let validBody = validateSite(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details);
        return;
    }
    try {
        let id = req.params.id;
        let data = req.body;
        let result = await SiteModel.updateOne({ _id: id }, data);
        res.json(result);
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({ message: "There is a problem try again later", err });
    }
});

router.delete("/:delId",async(req,res)=>{
    let delId = req.params.delId
    let data = await SiteModel.deleteOne({_id: delId})
    res.json(data);
})

module.exports = router;