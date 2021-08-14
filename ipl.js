require("chromedriver");

let wd = require("selenium-webdriver");
let chrome = require("selenium-webdriver/chrome");
let browser = new wd.Builder().forBrowser('chrome').build();
let fs = require('fs');

let batsmanColumns = ["PlayerName" , "out" , "TotalRuns" , "TotalBalls" , "ToatlFours" , "TotalSixes" , "StrikeRate"];
let links = []; 
let finalData = {};
let teams = [];

async function main(){
    await browser.get("https://www.cricbuzz.com/cricket-series/3130/indian-premier-league-2020/matches");
    await browser.wait(wd.until.elementLocated(wd.By.css(".text-hvr-underline")));
    let urls = await browser.findElements(wd.By.css(".text-hvr-underline"));
    for(let i = 0 ; i < urls.length - 2 ; i++){
        links[i] = await urls[i].getAttribute("href"); 
    }
    for(let x = 0 ; x < 4; x++){
        await browser.get(links[x]);
        await browser.wait(wd.until.elementLocated(wd.By.css(".cb-nav-bar a")));
        let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
        await buttons[1].click();
        await browser.wait(wd.until.elementLocated(wd.By.css(".cb-col.cb-col-100.cb-ltst-wgt-hdr a")));
        let tables = await browser.findElements(wd.By.css(".cb-col.cb-col-100.cb-ltst-wgt-hdr"));

        let team = await browser.findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-hdr-rw"));
        let team1Name = await team[0].getAttribute("innerText");
        let team2Name = await team[1].getAttribute("innerText");

        let n = await team1Name.search("Innings");
        team1Name = team1Name.slice(0,n);
      
        let m = await team2Name.search("Innings");
        team2Name = team2Name.slice(0,m);
      
        finalData[team1Name] = {};
        finalData[team2Name] = {};
        
        let inning1BatsmanRows = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
        let inning2BatsmanRows = await tables[3].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
      
        for(let i  = 0 ; i < (inning1BatsmanRows.length) ; i++){
            let columns = await inning1BatsmanRows[i].findElements(wd.By.css("div"));
            let data = {};
            let playerName = await columns[0].getAttribute("innerText");
            if(columns.length  == 7){
                for(j in  columns){
                    if(j>1){
                        data[batsmanColumns[j]] = await columns[j].getAttribute("innerText");
                    }
                }
                let readData = fs.readFileSync("IPLdata.json" , "utf-8");
            }
        }

        for(let i  = 0 ; i < (inning2BatsmanRows.length) ; i++){
            let columns = await inning2BatsmanRows[i].findElements(wd.By.css("div"));
            let data = {};
            let playerName = await columns[0].getAttribute("innerText");
            if(columns.length  == 7){
                for(j in  columns){
                    if(j>1){
                        data[batsmanColumns[j]] = await columns[j].getAttribute("innerText");
                    }
                }
            finalData[team2Name][playerName] = data;
            }
        }
       
      fs.writeFileSync("IPLdata.json", JSON.stringify(finalData));

    }
}
main();