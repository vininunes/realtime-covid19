const puppeteer = require('puppeteer');
 
const start = async () => {
    const browser = await puppeteer.launch( { headless: true } );
    const page = await browser.newPage();
    await page.goto('https://covid.saude.gov.br/');
   
    const container = await page.evaluate(() => {
        const recoveredCases = document.querySelectorAll(".lb-total.tp-geral")[0].innerText;
        const accompaniment = document.querySelectorAll(".lb-total.tp-geral")[1].innerText;
        const accumulated = document.querySelectorAll(".lb-total.tp-geral")[2].innerText;
        return [recoveredCases, accompaniment]
    });
    
    console.log(container[0]);
    console.log(container[1]);
    await browser.close();
};

start();