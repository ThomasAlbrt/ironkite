const express = require("express");
const router = new express.Router();
const protectAdminRoute = require("../middlewares/protectAdminRoute");
const spotModel = require("./../models/Spot");
const userModel = require("./../models/User");
const data = require("../public/js/scraping");


router.get("/", (req, res) => {
    res.render("index", {
        js: ["best-spot.js"]
    })
});

router.get("/home", (req, res) => {
    res.render("index", {
        js: ["best-spot.js"]
    })
});

router.get("/all-spots", (req, res) => {
    spotModel
        .aggregate([{
            '$project': {
                'spotName': 1,
                'windMax': {
                    '$max': '$wind'
                },
                'url': 1
            }
        }])
        .then(dbRes => {
            res.render("spots", {
                spots: dbRes,
                css: ["spots"],
                js: ["add-favorites.js"]
            })
        })
        .catch(err => console.log(err))
})

router.post("/add-favorites", (req, res) => {
    userModel
        .findOneAndUpdate({
            _id: req.session.currentUser._id
        }, {
            $addToSet: {
                favorites: req.body.id
            }
        })
        .then(dbRes => console.log(dbRes))
        .catch(err => console.log(err))
})



router.get("/favorites", (req, res) => {
    userModel
        .findOne({
            _id: req.session.currentUser._id
        })
        .populate("favorites")
        .then(dbRes => {

            const copy = dbRes.toJSON(); // clone le res pour pouvoir le modifier
            const windys = {};

            dbRes.favorites.forEach(spot => {
                spot.wind.forEach(windForce => {
                    if (!windys[spot._id]) windys[spot._id] = windForce;
                    windys[spot._id] = windForce > windys[spot._id] ? windForce : windys[spot._id];
                })
            });

            copy.favorites.forEach(spot => spot.maxWindValue = windys[spot._id]);

            res.render("favorites", {
                user: copy
            })
        })
        .catch(err => console.log(err))
})

router.post("/best-spot", (req, res) => {
    spotModel
        .aggregate([{
            '$project': {
                'spotName': 1,
                'windMax': {
                    '$max': '$wind'
                },
                'url': 1
            }
        }, {
            '$sort': {
                'windMax': -1
            }
        }, {
            '$limit': 1
        }])
        .then(dbRes => {
            console.log(dbRes)
            res.send(dbRes)
        })
        .catch(err => console.log(err))
})

module.exports = router;