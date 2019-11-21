import axios from "./api-service.js";

const heartButtons = document.querySelectorAll(".far");

heartButtons.forEach(heart => {
    heart.onclick = handleHeart
})

function handleHeart(evt) {
    let id = evt.target.getAttribute("data-id");
    axios.post("/add-favorites", {
            id: id
        })
        .then(apiRes => {
            console.log(apiRes.data);
            updateSpotContainer(apiRes.data)
        })
        .catch(err => console.log(err))
};