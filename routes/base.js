const express = require("express");
const router = new express.Router();
const protectAdminRoute = require("../middlewares/protectAdminRoute");
const spotModel = require("./../models/Spot");
const userModel = require("./../models/User");
const data = require("../public/js/scraping");


router.get("/", (req, res) => {
    res.render("index")
});

router.get("/home", (req, res) => {
    res.render("index")
});

router.get("/get-favorites-spots", protectAdminRoute, (req, res) => {
    userModel
        .findById(req.session.currentUser._id)
        .then(user => res.send(user.favorites))
        .catch(err => console.log(err))
})


router.get("/all-spots", protectAdminRoute, (req, res) => {
    spotModel
        .aggregate([{
            '$project': {
                'spotName': 1,
                'region': 1,
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
                js: ["add-favorites.js", "filter-region.js"]
            })
        })
        .catch(err => console.log(err))
})

router.post("/filter-region", protectAdminRoute, (req, res) => {
    Promise.all([spotModel
            .find({
                region: req.body.region
            }), userModel
            .findById(req.session.currentUser._id)
        ])
        .then(dbRes => {
            console.log(dbRes[1]);
            res.send(dbRes);
        })
        .catch(err => console.log(err))
})

router.post("/remove-favorites", protectAdminRoute, (req, res) => {
    userModel
        .findOneAndUpdate({
            _id: req.session.currentUser._id
        }, {
            $pull: {
                favorites: req.body.id
            }
        })
        .then(dbRes => console.log(`result remove favorites: ${dbRes}`))
        .catch(err => console.log(err))
})

router.post("/remove-favorite-page", protectAdminRoute, (req, res) => {
    userModel
        .findOneAndUpdate({
            _id: req.session.currentUser._id
        }, {
            $pull: {
                favorites: req.body.id
            }
        })
        .populate("favorites")
        .then(dbRes => {
            console.log(dbRes.favorites)
            res.send(dbRes)
        })
        .catch(err => console.log(err))
})

router.post("/add-favorites", protectAdminRoute, (req, res) => {
    userModel
        .findOneAndUpdate({
            _id: req.session.currentUser._id
        }, {
            $addToSet: {
                favorites: req.body.id
            }
        })
        .then(dbRes => console.log(`result add favorites: ${dbRes}`))
        .catch(err => console.log(err))
})


router.get("/favorites", protectAdminRoute, (req, res) => {
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
                user: copy,
                css: ["favorites"],
                js: ["add-favorites.js"]
            })
        })
        .catch(err => console.log(err))
})


module.exports = router;