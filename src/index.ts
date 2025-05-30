import { readConfig , setUser} from "./config.js";

function main() {
  setUser("Kindrid")
  const cfg = readConfig();
  console.log(cfg)
}
main();