#!node

const cli = require("cli")
const fs = require("fs")
const JsonRefs = require("json-refs");

const sourcePath = __dirname+"/../src/config";
const targetPath = __dirname+"/../generated/config";

ensureDir(targetPath)
ensureDir(targetPath+"/global")
ensureDir(targetPath+"/level")

resolve("/global/characters.json",sourcePath, targetPath)
resolve("/global/powers.json",sourcePath, targetPath)

const dirs = fs.readdirSync(sourcePath+"/level")
dirs.forEach(dir=> {
    ensureDir(targetPath+"/level/"+dir)
    resolve("/level/"+dir+"/level.json",sourcePath, targetPath)
})
resolve("/global/powers.json",sourcePath, targetPath)

function resolve(name, source, target) {
    console.log("resolve",name,source,target)
    JsonRefs.resolveRefsAt(source+name).then(rs => {
        console.log("success",source,target)
         fs.writeFileSync(target+name,JSON.stringify(rs.resolved,undefined,3));
    })
}

function ensureDir(dir) {
    try {
        fs.mkdirSync(dir)
    } catch (e) {

    }
}
