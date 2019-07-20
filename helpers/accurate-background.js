import fetch from "node-fetch";

const createCustomer = () =>
  new Promise((resolve, reject) => {
    const dataString = JSON.stringify({
      firstName: "Albert",
      lastName: "Einstein",
      phone: "206-555-1212",
      dateOfBirth: "1972-05-26",
      ssn: "531-90-1234",
      email: "bert@physics.org"
    });
    const url = "https://api.accuratebackground.com/v3/candidate/"
    const username = "b97083ec-d9c1-4d5f-b88c-06c43b4eed0f";
    const password = "7f90b0d1-33ca-4bba-9418-e1e4bcd3ab13";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
        "base64"
      )}`
    };
    const myHeaders = new fetch.Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
    );
    const options = {
      method: "POST",
      headers,
      body: dataString
    };
    fetch(url, options)
      .then(res => res.json()) // expecting a json response
      .then(json => console.log(JSON.stringify(json)))
      .then(body => resolve(body))
      .catch(error => reject(error));
  });

createCustomer();
