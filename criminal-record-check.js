import { success, failure } from "./libs/response-lib";
import { createCandidate, placeOrder } from "./helpers/accurate-background";

export default async function main(event) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const candidateInformation = {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth,
    ssn: data.ssn,
    email: data.email,
    city: data.city,
    country: data.country,
    postalCode: data.postalCode,
    address: data.address
  };

  try {
    const candidate = await createCandidate(candidateInformation);
    console.log("finish candidate", candidate)
    const orderInformation = {
      id: candidate.id,
      packageType: "PKG_EMPTY",
      workflow: "EXPRESS",
      jobLocation: {
        country: data.country,
        region: data.state,
        city: data.city
      },
      copyOfReport: "false"
    };

    const order = await placeOrder(orderInformation);
    console.log("finish order", order)
    return success({ id: "Hello", status: "GoodBye" });
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}
