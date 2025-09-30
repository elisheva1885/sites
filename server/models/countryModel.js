const mongoose = require("mongoose")
const Joi = require("joi");

let countrySchema = new mongoose.Schema({
    capital: String,
    pop: Number,
    img: String,
    date_created: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

exports.CountryModel = mongoose.model("countries",countrySchema);


exports.validateCountry = (_reqBody) => {
    let joiSchema = Joi.object({
      capital: Joi.string().min(2).max(100).required(),
      pop: Joi.number().min(0).max(10000000000).required(),
      img: Joi.string().min(5).max(300),
      // date_created לא צריך כי הוא נוצר אוטומטית
      user_id: Joi.string().hex().length(24) // בדיקה שזה ObjectId תקין
    });
    return joiSchema.validate(_reqBody);
  }
  
