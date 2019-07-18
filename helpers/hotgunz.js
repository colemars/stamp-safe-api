const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

const getStolenRecord = (serialNumber) => new Promise((resolve, reject) => {

  const params = new URLSearchParams();
  params.append('q', serialNumber);
  
  const options = {
    method: 'POST',
    body: params
  };

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

module.exports = {
  getStolenRecord,
};
