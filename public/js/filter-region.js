import axios from "./api-service.js";

const regionSelector = document.getElementById("selector");
const spotsContainer = document.getElementById("spots-list");
const heartButtons = document.querySelectorAll(".fa-heart");

regionSelector.onchange = (evt) => {
    let region = evt.target.value;
    axios.post("/filter-region", {
            region: region
        })
        .then(apiRes => {

            let favorites = apiRes.data[1].favorites;
            let spots = apiRes.data[0];

            console.log(favorites);
            console.log(spots);

            updateSpotsContainer(spots, favorites)
        })
        .catch(err => console.log(err))
};


function updateSpotsContainer(spots, favorites) {
    spotsContainer.innerHTML = "";

    for (let spot of spots) {
        const maxWind = Math.max(...spot.wind);
        const tpl = `
        <div class="spot-container">
        <div class="spot-image-container"></div>
        <div class="spot-infos">
            <ul>
                <h4>${spot.spotName}</h4>
                <li>${maxWind} noeuds max attendus</li>
                <li>${spot.region}</li>
                <li><button><a href="${spot.url}">Voir la page windguru</a></button></li>
                <i data-id="${spot._id}" class="far fa-heart after-call"></i>
            </ul>
        </div>
    </div>`;

        spotsContainer.innerHTML += tpl;
    }

    const heartPostAxios = document.querySelectorAll(".after-call")

    for (let btn of heartPostAxios) {
        if (favorites.includes(btn.getAttribute("data-id"))) btn.classList.add("fas");
    }

}