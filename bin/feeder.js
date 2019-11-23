const mongoose = require("mongoose");
const spotModel = require("../models/Spot");
const data = require("../public/js/scraping");

async function feedDb() {
    try {
        const apiRes = await data()
        apiRes.forEach(spot => {
            spotModel
                .findOneAndUpdate({
                    url: spot.url
                }, {
                    url: spot.url,
                    wind: spot.wind
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