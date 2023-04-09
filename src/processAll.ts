import { readFileSync, writeFileSync } from "fs";
import { process } from './process';
import { MacroBuilder } from "./MacroBuilder";

export function processAll(macroMap: {
    [originalMacroKeys: string]: MacroBuilder;
}, keymapFile: string) {
    const loaded = readFileSync(keymapFile).toString();

    const backup = keymapFile + Math.random() + ".old.c";
    console.log("Backed up keymap.c to " + backup);
    writeFileSync(backup, loaded);

    const newConfig = process(loaded, macroMap);
    writeFileSync(keymapFile, newConfig);
    console.log("ALL done! Proceed with compilation and flashing");
};
