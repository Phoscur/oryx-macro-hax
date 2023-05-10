import { readFileSync, writeFileSync } from "fs";
import { expandMacros } from "./expandMacros";
import { newMacro, MacroBuilder } from "./MacroBuilder";

const MACROS_DIR = "../macros/";
const { LAYOUT_FOLDER, LAYOUT_SRC, USER_NAME } = process.env;

interface UserConfig {
    prepare(newMacro: (expectedReplacementCount?: number) => MacroBuilder): {
        macroExtensions: {
            [id: string]: MacroBuilder,
        },
    }
}

export default async function main(
    userName: string,
    keymapFolder: string,
    layoutSrc = "./layout_src",
) {
    const keymapSource = `${layoutSrc}/${keymapFolder}/keymap.c`;
    console.log(`Reading Keymap Source for User ${userName}: ${keymapSource}`);
    if (!userName || !(typeof userName === "string")) {
        throw new Error("USER_NAME cannot be empty");
    }
    const userConfig = await import(MACROS_DIR + userName.toLowerCase()) as UserConfig;
    const macroMap = userConfig.prepare(newMacro).macroExtensions;

    const loaded = readFileSync(keymapSource).toString();
    const newConfig = expandMacros(loaded, macroMap);

    const backup = `${keymapSource}${Math.random()}.old.c`;
    writeFileSync(backup, loaded);
    console.log("Backed up keymap.c to " + backup);

    writeFileSync(keymapSource, newConfig);
    console.log("ALL done! Proceed with compilation and flashing");
}

if (typeof require !== "undefined" && require.main === module) {
    main(
        process.argv[2] || USER_NAME,
        process.argv[3] || LAYOUT_FOLDER,
        process.argv[4] || LAYOUT_SRC,
    );
}
