import { JSDOM } from "jsdom";
import getStolenRecord from "./helpers/hotgunz";
import { success, failure } from "./libs/response-lib";

export default function main(event) {
  const data = JSON.parse(event.body);
  getStolenRecord(data.serialNumber)
    .then(body => {
      const dom = new JSDOM(body);
      const { document } = dom.window;
      const result = document.querySelector("#flash").textContent;
      if (result.toLowerCase() === "warning: stolen firearm")
        return success("stolen");
      return success("not found");
    })
    .catch(e => {
      return failure({ e });
    });
}
