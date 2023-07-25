//import React from 'react';
import { parseString } from 'xml2js';
import axios from 'axios';

const URL = 'https://www.cbr.ru/scripts/XML_daily.asp';

function Xml(Datafromxml) {
  return new Promise((resolve, reject) => {
    parseString(Datafromxml, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function Dates(date) {
  let [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

async function Getting(cd, data) {
  let Dateform = Dates(data);
  let Url = `${URL}?date_req=${Dateform}`;

  try {
  
    let answ = await axios.get(Url);
    let xml = answ.data;
    let final = await Xml(xml);
    let value = final.ValCurs.Valute.find(
      (valute) => valute.CharCode[0] === cd.toUpperCase()
    );

    if (value) {
      console.log(`${value.CharCode[0]} (Доллар США): ${value.Value[0]}`);
    } else {
      console.log('Не верно указана дата -> нет данных');
    }
  } catch (error) {
    console.error('Данные не получены:', error.message);
  }
}

let a = process.argv.slice(2);
if (a.length !== 2) {

  // example
  // node index --code=USD --date=2023-07-03

  console.log('node index --code=USD --date=2023-07-25');
} else {
  let cd = a[0].split('=')[1];
  let data = a[1].split('=')[1];
  Getting(cd, data);
}