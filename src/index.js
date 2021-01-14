const puppeteer = require('puppeteer');
const fs = require('fs');

const start = async () => {
    const browser = await puppeteer.launch( { headless: false } );
    const page = await browser.newPage();
    await page.goto('https://covid.saude.gov.br/');
   
    const container = await page.evaluate(() => {
        const updateDate = document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[1].querySelectorAll(".lb-nome.lb-value")[4].innerText.split("\n")[1];    
        const recoveredCases = document.querySelectorAll(".lb-total.tp-geral")[0].innerText;
        const accompaniment = document.querySelectorAll(".lb-total.tp-geral")[1].innerText;
        const accumulated = document.querySelectorAll(".lb-total.tp-geral")[2].innerText;
        const newCases = document.querySelectorAll(".lb-total.tp-geral")[3].innerText;
        const accidentalDeaths = document.querySelectorAll(".lb-total.tp-geral")[5].innerText;
        const newDeaths = document.querySelectorAll(".lb-total.tp-geral")[6].innerText;

        const regs = {
                sul: {
                    cases: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[1].querySelectorAll(".lb-nome.lb-value")[0].innerText.split("\n"),
                    deaths: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[1].querySelectorAll(".lb-nome.lb-value")[1].innerText.split("\n"),    
                    incidence: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[1].querySelectorAll(".lb-nome.lb-value")[2].innerText.split("\n"), 
                    mortality: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[1].querySelectorAll(".lb-nome.lb-value")[3].innerText.split("\n"), 
                },
                centro_oeste: {
                    cases: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[3].querySelectorAll(".lb-nome.lb-value")[0].innerText.split("\n"),
                    deaths: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[3].querySelectorAll(".lb-nome.lb-value")[1].innerText.split("\n"),    
                    incidence: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[3].querySelectorAll(".lb-nome.lb-value")[2].innerText.split("\n"), 
                    mortality: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[3].querySelectorAll(".lb-nome.lb-value")[3].innerText.split("\n"), 
                },
                nordeste: {
                    cases: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[2].querySelectorAll(".lb-nome.lb-value")[0].innerText.split("\n"),
                    deaths: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[2].querySelectorAll(".lb-nome.lb-value")[1].innerText.split("\n"),    
                    incidence: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[2].querySelectorAll(".lb-nome.lb-value")[2].innerText.split("\n"), 
                    mortality: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[2].querySelectorAll(".lb-nome.lb-value")[3].innerText.split("\n"), 
                },
                sudeste: {
                    cases: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[0].querySelectorAll(".lb-nome.lb-value")[0].innerText.split("\n"),
                    deaths: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[0].querySelectorAll(".lb-nome.lb-value")[1].innerText.split("\n"),    
                    incidence: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[0].querySelectorAll(".lb-nome.lb-value")[2].innerText.split("\n"), 
                    mortality: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[0].querySelectorAll(".lb-nome.lb-value")[3].innerText.split("\n"), 
                },
                norte: {
                    cases: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[4].querySelectorAll(".lb-nome.lb-value")[0].innerText.split("\n"),
                    deaths: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[4].querySelectorAll(".lb-nome.lb-value")[1].innerText.split("\n"),    
                    incidence: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[4].querySelectorAll(".lb-nome.lb-value")[2].innerText.split("\n"), 
                    mortality: document.querySelectorAll(".display-flex.justify-between.item-line.width-full.pd-left")[4].querySelectorAll(".lb-nome.lb-value")[3].innerText.split("\n"), 
                },
        }
        
        return {
            updateDate: updateDate,
            recoveredCases: recoveredCases.split("\n")[1],
            accompaniment: accompaniment.split("\n")[1],
            accumulated: accumulated.split("\n")[0],
            newCases: newCases.split("\n")[0],
            accidentalDeaths: accidentalDeaths.split("\n")[0],
            newDeaths: newDeaths.split("\n")[0],
            regs: regs
        }
    });
    
    await browser.close();
    const newData = await verifyUndefinedData(container);
    await writeFile(JSON.stringify(newData, null, 4));
};

const verifyUndefinedData = (data) => {
    // console.table(data);
    for(let i in data){
        if(!data[i])
            data[i] = "Não divulgado!";
        if(typeof(data[i]) === "object"){
            for(let j in data[i]){
                if(!data[i][j])
                    data[i][j] = "Não divulgado!";
                if(typeof(data[i][j]) === "object"){
                    for(let z in data[i][j]){
                        if(!data[i][j][z])
                            data[i][j][z] = "Não divulgado!";
                    }
                }
            }
        }
    }
    return data;
}

const writeFile = (data) => {
    fs.writeFile('./db/covid_datas.json', data, err => {
        err ? console.log('err (WriteFile)') : console.log('Write File!');
    });
};

start();