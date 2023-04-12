import { readFileSync, writeFileSync } from "fs";
import { expandMacros } from './expandMacros';
import { newMacro } from "./MacroBuilder";

const MACROS_DIR = "../macros/";
const {
    LAYOUT_FOLDER,
    LAYOUT_SRC,
    USER_NAME,
} = process.env;

export default async function main(userName: string, keymapFolder: string, layoutSrc = "./layout_src") {
    const keymapSource = `${layoutSrc}/${keymapFolder}/keymap.c`;
    console.log(`Reading Keymap Source for User ${userName}: ${keymapSource}`);
    if (!userName || !(typeof userName === "string")) {
        throw new Error("USER_NAME cannot be empty");
    }
    const userConfig = await import(MACROS_DIR + userName.toLowerCase());
    const macroMap = userConfig.prepare(newMacro).macroExtensions;

    const loaded = readFileSync(keymapSource).toString();
    const newConfig = expandMacros(loaded, macroMap);

    const backup = keymapSource + Math.random() + ".old.c";
    writeFileSync(backup, loaded);
    console.log("Backed up keymap.c to " + backup);

    writeFileSync(keymapSource, newConfig);
    console.log("ALL done! Proceed with compilation and flashing");
}

if (typeof require !== 'undefined' && require.main === module) {
    main(USER_NAME, LAYOUT_FOLDER, LAYOUT_SRC);
}
