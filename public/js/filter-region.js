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
            console.log(apiRes.data[0]);

            let favorites = apiRes.data[1].favorites;
            let spots = apiRes.data[0];

            updateSpotsContainer(spots, favorites)
        })
        .catch(err => console.log(err))
};


function updateSpotsContainer(spots, favorites) {
    spotsContainer.innerHTML = "";
    spots.forEach(spot => {
        // heartButtons.forEach(btn => {
        //     let heartClass;
        //     favorites.includes(btn.getAttribute("data-id")) ? heartClass = "fas" : heartClass = "far";
        // })
        const tpl = `
        <div class="spot-container">
        <div class="spot-image-container"></div>
        <div class="spot-infos">
            <ul>
                <li>${spot.spotName}</li>
                <li>${spot.wind}</li>
                <li>${spot.region}</li>
                <li><button><a href="${spot.url}">Voir la page windguru</a></button></li>
                <i data-id="5dd6611b1ea85439a952f202" class="far fa-heart"></i>
            </ul>
        </div>
    </div>`;
        spotsContainer.innerHTML += tpl;
    })

}