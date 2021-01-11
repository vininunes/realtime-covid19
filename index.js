const puppeteer = require('puppeteer');
 
const start = async () => {
    const browser = await puppeteer.launch( { headless: true } );
    const page = await browser.newPage();
    await page.goto('https://covid.saude.gov.br/');
   
    const container = await page.evaluate(() => {
        const recoveredCases = document.querySelectorAll(".lb-total.tp-geral")[0].innerText;
        const accompaniment = document.querySelectorAll(".lb-total.tp-geral")[1].innerText;
        const accumulated = document.querySelectorAll(".lb-total.tp-geral")[2].innerText;
        const newCases = document.querySelectorAll(".lb-total.tp-geral")[3].innerText;
        const accidentalDeaths = document.querySelectorAll(".lb-total.tp-geral")[5].innerText;
        const newDeaths = document.querySelectorAll(".lb-total.tp-geral")[6].innerText;
        return {
            recoveredCases: recoveredCases.split("\n")[1],
            accompaniment: accompaniment.split("\n")[1],
            accumulated: accumulated.split("\n")[0],
            newCases: newCases.split("\n")[0],
            accidentalDeaths: accidentalDeaths.split("\n")[0],
            newDeaths: newDeaths.split("\n")[0]
        }
    });
    
    // console.log(container.recoveredCases);
    // console.log(container.accompaniment);
    // console.log(container.accumulated);
    // console.log(container.newCases);
    // console.log(container.accidentalDeaths);
    // console.log(container.newDeaths);
    console.table(container)
    await browser.close();
};

start();