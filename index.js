const puppeteer = require('puppeteer');
 
const start = async () => {
    const browser = await puppeteer.launch( { headless: false } );
    const page = await browser.newPage();
    await page.goto('https://news.google.com/covid19/map?hl=pt-BR&gl=BR&ceid=BR%3Apt-419&mid=%2Fm%2F09c7w0');
   
    // await browser.close();
};

start();