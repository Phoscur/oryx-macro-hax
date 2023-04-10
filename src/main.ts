import { readFileSync, writeFileSync } from "fs";
import { expandMacros } from './expandMacros';
import { newMacro } from "./MacroBuilder";

const MACROS_DIR = "../macros/";
const {
    LAYOUT_FOLDER,
    LAYOUT_SRC,
    USER_NAME,
} = process.env;

const KEYMAP_SOURCE = `${LAYOUT_SRC || './layout_src'}/${LAYOUT_FOLDER}/keymap.c`;

export default async function main(keymapFile: string) {
    console.log(`Keymap Source: ${keymapFile}, User: ${USER_NAME}`);
    const userConfig = await import(MACROS_DIR + USER_NAME);
    const macroMap = userConfig.prepare(newMacro).macroExtensions;

    const loaded = readFileSync(keymapFile).toString();

    const backup = keymapFile + Math.random() + ".old.c";
    console.log("Backed up keymap.c to " + backup);
    writeFileSync(backup, loaded);

    const newConfig = expandMacros(loaded, macroMap);
    writeFileSync(keymapFile, newConfig);
    console.log("ALL done! Proceed with compilation and flashing");
}

if (typeof require !== 'undefined' && require.main === module) {
    main(KEYMAP_SOURCE);
}
