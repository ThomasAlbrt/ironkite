import axios from "./api-service.js";

const bestSpotButton = document.getElementById("ride-button");
const spotContainer = document.getElementById("results");

bestSpotButton.onclick = () => {
    axios.post("/best-spot")
        .then(apiRes => {
            console.log(apiRes.data);
            updateSpotContainer(apiRes.data)
        })
        .catch(err => console.log(err))
};


function updateSpotContainer(spot) {
    spotContainer.innerHTML = `
    <p class="spot">${spot[0].spotName}</p>
    <p class="spot">${spot[0].windMax}</p>
    <button><a href=${spot[0].url}>Voir la page windguru</a></button>
    `;
}