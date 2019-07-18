import jsdom from "jsdom";

import getStolenRecord from "./helpers/hotgunz";

export default function main(event, callback) {
  const { JSDOM } = jsdom;
  getStolenRecord(event.pathParameters.id)
    .then(body => {
      const dom = new JSDOM(body);
      const { document } = dom.window;
      const result = document.querySelector("#flash").textContent;
      return result;
    })
    .catch(error => {
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error })
      });
    });
}
