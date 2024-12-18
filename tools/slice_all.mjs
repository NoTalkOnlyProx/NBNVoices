import fs from "fs";
import {slice} from "./slicing.mjs";

async function main() {
    let files = fs.readdirSync("./raw");
    let targets = files.filter(filename => filename.match(/.*\.wav$/g));
    Promise.all(targets.map(async target => {
        await slice(`./raw/${target}`);
    }));
}

main();