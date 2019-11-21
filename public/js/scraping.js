const puppeteer = require("puppeteer");
const spots = require("./data");

const spotScraping = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const spotsInfos = [];
    try {
        for (let spot of spots) {
            url = spot;
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 0
            });

            if (await page.$("#sncmp-popup-ok-button")) {
                const cookieAcceptBtn = await page.$("#sncmp-popup-ok-button");
                await cookieAcceptBtn.click();
            }

            let dataObj = {};

            const spotName = await page.evaluate(() => {
                return document.querySelector("#forecasts-page-content > div.spot-header > div.spot.wg > a:nth-child(1) > div").textContent;
            })

            console.log(spotName)

            const windArr = await page.evaluate(() => {
                const target = document.getElementById("tabid_0_0_GUST");
                const gustRow = target.querySelectorAll("td");
                const gustArr = Array.from(gustRow);
                const extraGust = gustArr.splice(7);

                const wind = [];
                gustArr.forEach(gust => wind.push(Number(gust.textContent)));
                return wind;
            })

            dataObj = {
                spotName: spotName,
                wind: windArr,
                region: "Bretagne",
                url: url
            }

            spotsInfos.push(dataObj);
        }

        await browser.close();
        return spotsInfos;

    } catch (err) {
        console.log(err);

    }
};

module.exports = spotScraping;