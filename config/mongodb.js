const mongoose = require("mongoose");
const spotModel = require("../models/Spot");
const data = require("../public/js/scraping");


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
});

mongoose.connection.on("connected", () => console.log("yay mongodb connected :)"));

mongoose.connection.on("error", () => console.log("nay db error sorry :("));


async function feedDb() {
  const apiRes = await data()

  apiRes.forEach(spot => {
    spotModel
      .findOneAndUpdate({
        spotName: spot.spotName,
        wind: spot.wind,
        region: spot.region,
        url: spot.url
      }, {
        expire: new Date()
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(dbRes => console.log(dbRes))
      .catch(err => {
        console.log(err)
      });
  })
}

// feedDb();