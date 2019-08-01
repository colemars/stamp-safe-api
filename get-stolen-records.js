import { JSDOM } from "jsdom";
import getStolenRecord from "./helpers/hotgunz";
import { success } from "./libs/response-lib";

export default async function main(event) {
  const data = JSON.parse(event.body);
  const result = await getStolenRecord(data.serialNumber);
  const dom = new JSDOM(result);
  const { document } = dom.window;
  const stolen = document.querySelector("#flash").textContent;
  if (stolen.toLowerCase() === "warning: stolen firearm")
    return success({ result: "Stolen" });
  return success({ result: "Not found" });
}
