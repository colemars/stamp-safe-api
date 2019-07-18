const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

const params = new URLSearchParams();
params.append('q', "MFG1243");

const options = {
  method: 'POST',
  body: params
};

const getStolenRecord = () => new Promise((resolve, reject) => {
  fetch("https://www.hotgunz.com/search.php", options)
            .then(res => res.text())
            // .then(function(body){
            //   const dom = new JSDOM(body);
            //   const document = dom.window.document;
            //   const result = document.querySelector('#flash');
            //   console.log(result)
            // })
            .then(body => resolve(body))
            .catch(error => reject(error));
});

getStolenRecord();

module.exports = {
  getStolenRecord,
};
