'use strict';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { getStolenRecord } = require('./helpers/hotgunz');

export function main(event, context, callback) {
  getStolenRecord()
    .then((body) => {
      const dom = new JSDOM(body);
      const document = dom.window.document;
      const result = document.querySelector('#flash').textContent;
      console.log(result);
      return result;
    })
    .catch((error)=>{
      return callback(null, { statusCode: 500, body: JSON.stringify({ error }) });
    })
};
