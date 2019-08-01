import fetch from "node-fetch";

const getStolenRecord = serialNumber =>
  new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append("q", serialNumber);
    const options = {
      method: "POST",
      body: params
    };

    fetch("https://www.hotgunz.com/search.php", options)
      // .then(checkStatus) It is common to create a helper function to check that the response contains no client (4xx) or server (5xx) error responses:
      .then(res => res.text())
      .then(body => resolve(body))
      .catch(error => reject(error));
  });
export default getStolenRecord;
