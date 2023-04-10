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
    console.log(`Reading Keymap Source: ${keymapFile}, User: ${USER_NAME}`);
    const userConfig = await import(MACROS_DIR + USER_NAME.toLowerCase());
    const macroMap = userConfig.prepare(newMacro).macroExtensions;

    const loaded = readFileSync(keymapFile).toString();
    const newConfig = expandMacros(loaded, macroMap);

    const backup = keymapFile + Math.random() + ".old.c";
    writeFileSync(backup, loaded);
    console.log("Backed up keymap.c to " + backup);

    writeFileSync(keymapFile, newConfig);
    console.log("ALL done! Proceed with compilation and flashing");
}

if (typeof require !== 'undefined' && require.main === module) {
    main(KEYMAP_SOURCE);
}
