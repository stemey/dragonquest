const cli = require("cli");
const fs = require("fs");

const options = cli.parse({
    name: ["n", "name", "string"],
});

if (!options.name) {
    console.error("please provide a name");
    process.exit(1);
}

const baseDir = __dirname + "/..";
const assetsDirs = fs.readdirSync(baseDir + "/assets/level");
if (assetsDirs.indexOf(options.name) >= 0) {
    console.warn(
        `a level assets folder with name ${options.name} already exists`
    );
} else {
    fs.mkdirSync(baseDir + "/assets/level/" + options.name);
    fs.copyFileSync(
        baseDir + "/templates/level/assets/map.json",
        baseDir + "/assets/level/" + options.name + "/map.json"
    );
    console.info("assets created");
}
const configDirs = fs.readdirSync(baseDir + "/src/config/level");
if (configDirs.indexOf(options.name) >= 0) {
    console.warn(
        `a level config folder with name ${options.name} already exists`
    );
} else {
    fs.mkdirSync(baseDir + "/src/config/level/" + options.name);
    fs.copyFileSync(
        baseDir + "/templates/level/config/level.json",
        baseDir + "/src/config/level/" + options.name + "/level.json"
    );
    console.info("config created");
}
