import axios from "./api-service.js";

const heartButtons = document.querySelectorAll(".far");
const crossButtons = document.querySelectorAll(".fa-times");
const favoritesContainer = document.querySelector(".spot-container");

axios.get("/get-favorites-spots")
    .then(apiRes => {
        let favorites = apiRes.data;
        heartButtons.forEach(btn => {
            if (favorites.includes(btn.getAttribute("data-id"))) btn.classList.toggle("fas")
        })
    }).catch(err => console.log(err))

crossButtons.forEach(cross => {
    cross.onclick = removeFromFavoritesPage
})

function removeFromFavoritesPage(evt) {
    let id = evt.target.getAttribute("data-id");
    axios.post("/remove-favorite-page", {
            id: id
        })
        .then(apiRes => {
            apiRes.data.favorites.forEach(fav => console.log(fav._id))
            let favoriteSpots = apiRes.data.favorites;
            console.log(favoriteSpots);
            updateFavPage(favoriteSpots)
        })
        .catch(err => console.log(err));
}

function updateFavPage(spots) {
    favoritesContainer.innerHTML = "";
    spots.forEach(spot => {
        const maxWind = Math.max(...spot.wind);
        const tpl = `
        <li>
            <div class="spot-infos">
                <i data-id="${spot._id}" class=" fas fa-times"></i>
                <h4>${spot.spotName}</h4>
                <p>${spot.region}</p>
                <p>${maxWind} noeuds max attendus</p>
                <button><a href="${spot.url}">Go on windguru</a></button>
            </div>
        </li>`;
        favoritesContainer.innerHTML += tpl;
    })
}

heartButtons.forEach(heart => {
    heart.onclick = (e) => {
        if (heart.classList.contains("fas")) {
            heart.classList.add("far");
            heart.classList.remove("fas");
            removeFav(e);
        } else {
            heart.classList.add("fas");
            heart.classList.remove("far");
            handleHeart(e);
        }
    }
})

function removeFav(evt) {
    let id = evt.target.getAttribute("data-id");
    axios.post("/remove-favorites", {
            id: id
        })
        .then(apiRes => {
            console.log(apiRes.data);
        })
        .catch(err => console.log(err))
};

function handleHeart(evt) {
    let id = evt.target.getAttribute("data-id");
    console.log("adding pending");
    axios.post("/add-favorites", {
            id: id
        })
        .then(apiRes => {
            console.log(apiRes.data);
        })
        .catch(err => console.log(err))
};