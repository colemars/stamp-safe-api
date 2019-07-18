import fetch from "node-fetch";
import { URLSearchParams } from "url";

const getStolenRecord = serialNumber =>
  new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append("q", serialNumber);
    const options = {
      method: "POST",
      body: params
    };

    fetch("https://www.hotgunz.com/search.php", options)
      .then(res => res.text())
      .then(body => resolve(body))
      .catch(error => reject(error));
  });
export default {
  getStolenRecord
};
