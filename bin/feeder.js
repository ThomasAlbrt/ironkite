const mongoose = require("mongoose");
const spotModel = require("../models/Spot");
const data = require("../public/js/scraping");

async function feedDb() {
    try {
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
    } catch (err) {
        console.log(err)
    }
}

feedDb();