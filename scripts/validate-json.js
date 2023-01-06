const fs = require("fs");
const cli = require("cli");
const Ajv = require("ajv");
const ajv = new Ajv({ strict: false }); // options can be passed, e.g. {allErrors: true}


const options = cli.parse({
},["fail"]);

const fail = cli.command;

const baseDir = __dirname + "/..";
let invalid=false;
try {
    const levelSchema = JSON.parse(
        fs.readFileSync(baseDir + "/generated/schemas/level.json").toString()
    );

    const validate = ajv.compile(levelSchema);

    const levels = fs.readdirSync(baseDir + "/generated/config/level");
    levels.forEach((name) => {
        const level = JSON.parse(
            fs
                .readFileSync(
                    baseDir + "/generated/config/level/" + name + "/level.json"
                )
                .toString()
        );
        const valid = validate(level);
        if (!valid) {
            invalid=true;
            console.error("error in " + name, validate.errors);

        }
    });
} catch (e) {
    console.warn("cannot validate", e);
}

if (fail && invalid ){
    process.exit(1)
}
