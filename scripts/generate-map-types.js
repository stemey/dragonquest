#!node

const fs = require("fs");

const sourceFile = __dirname + "/../assets/levels.tiled-project";
const baseTargetPath = __dirname + "/../generated/";
const targetPath = baseTargetPath + "/tiled-types";

ensureDir(baseTargetPath);
ensureDir(targetPath);

const project = JSON.parse(fs.readFileSync(sourceFile).toString());

const typeMapping = {
    string: "string",
    bool: "boolean",
    float: "number",
    int: "number",
};
const indent ="\t\t\t"
project.propertyTypes.forEach((propType) => {
    const properties = propType.members
        .map((m) => {
            console.log(m.name)
            const type = typeMapping[m.type];
            if (!type) return "";
            return `${indent}${m.name}:${type}`;
        })
        .join("\n");
    const ts = `
    export interface ${propType.name} {
${properties}        
    }  
    `;
    fs.writeFileSync(
        targetPath + "/" + propType.name + ".d.ts",
        Buffer.from(ts)
    );
});


function ensureDir(dir) {
    try {
        fs.mkdirSync(dir);
    } catch (e) {}
}
