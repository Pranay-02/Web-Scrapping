require("chromedriver");
let wd = require("selenium-webdriver");
let chrome = require("selenium-webdriver/chrome");
const { elementLocated } = require("selenium-webdriver/lib/until");

let browser = new wd.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();
let matchId = 33668
let innings = 1;

//Batsman Details
let batsmanColumns = ["PlayerName" , "out" , "Runs" , "Balls" , "Fours" , "Sixes"];
let inningBatsman = [];

// Bowlers Details
let bowlersColumns = ["PlayerName" , "Overs" , "Maidens" , "Runs" , "Wickets"];
let inningBowlers = [];

async function main() {
    await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchId}`);
    await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    await browser.wait(wd.until.elementLocated(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr a`)));
    let tables = await browser.findElements(wd.By.css(`#innings_${innings} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
    console.log(tables.length);

    // Batsmans
    let inningBatsmanRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i  = 0 ; i < (inningBatsmanRows.length) ; i++){
        let columns = await inningBatsmanRows[i].findElements(wd.By.css("div"));
        if(columns.length  == 7){
            let data = {};
            for(j in  columns){
                if(j!=1){
                    data[batsmanColumns[j]] = await columns[j].getAttribute("innerText");
                    
                }
            }
            inningBatsman.push(data);
        }
    }
    console.log(inningBatsman);

    // Bowlers
    let inningBowlersRows = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    for(let i  = 0 ; i < inningBowlersRows.length  ; i++){
        let columns = await inningBowlersRows[i].findElements(wd.By.css("div"));
        let data = {};
        for(j in  columns){
            if(j <= 4){
                data[bowlersColumns[j]] = await columns[j].getAttribute("innerText");
            }
        }
        inningBowlers.push(data);
    }
    console.log(inningBowlers);
}
main();

