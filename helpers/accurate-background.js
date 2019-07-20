import fetch from "node-fetch";

const createCandidate = candidateInformation =>
  new Promise((resolve, reject) => {
    const dataString = JSON.stringify({
      firstName: candidateInformation.firstName,
      lastName: candidateInformation.lastName,
      phone: candidateInformation.phone,
      dateOfBirth: candidateInformation.dateOfBirth,
      ssn: candidateInformation.ssn,
      email: candidateInformation.email
    });
    const uri = "https://api.accuratebackground.com/v3/candidate/";
    const clientId = "b97083ec-d9c1-4d5f-b88c-06c43b4eed0f";
    const clientSecret = "7f90b0d1-33ca-4bba-9418-e1e4bcd3ab13";
    const headers = new fetch.Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
    );
    const options = {
      method: "POST",
      headers,
      body: dataString
    };
    fetch(uri, options)
      .then(res => res.json()) // expecting a json response
      .then(json => console.log(JSON.stringify(json)))
      .then(json => resolve(json))
      .catch(error => reject(error));
  });

const placeOrder = candidateInformation =>
  new Promise((resolve, reject) => {
    const uri = "https://api.accuratebackground.com/v3/order/";
    const clientId = "b97083ec-d9c1-4d5f-b88c-06c43b4eed0f";
    const clientSecret = "7f90b0d1-33ca-4bba-9418-e1e4bcd3ab13";
    const headers = new fetch.Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append(
      "Authorization",
      `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
    );
    const param = new URLSearchParams();
    param.append("candidateId", candidateInformation.Id);
    param.append("packageType", "PKG_BASIC");
    param.append("workflow", "EXPRESS");
    param.append("jobLocation.country", candidateInformation.country);
    param.append("jobLocation.region", candidateInformation.region);
    param.append("jobLocation.city", candidateInformation.city);
    const options = {
      method: "POST",
      headers,
      body: param
    };
    fetch(uri, options)
      .then(res => res.json())
      .then(json => console.log(JSON.stringify(json)))
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
