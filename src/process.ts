import { MacroBuilder, charStrToMacro } from "./MacroBuilder";

const DANCES = {
  SINGLETAP: 'SINGLE_TAP',
  SINGLEHOLD: 'SINGLE_HOLD',
  DOUBLETAP: 'DOUBLE_TAP',
  DOUBLEHOLD: 'DOUBLE_HOLD',
};

function danceToFind(macroKeys: string) {
  if (!macroKeys.startsWith('dance_')) {
    return "SEND_STRING(" + charStrToMacro(macroKeys).build() + ")";
  }
  const step = macroKeys.split("_")[1];
  return "case " + DANCES[step] + ": register_code16(KC_" + macroKeys.split("_")[2] + "); break;";
}

export function process(keymapC: string, macroMap: {
  [originalMacroKeys: string]: MacroBuilder;
}): string {
  const macroNames = Object.keys(macroMap);

  const matchCounts = macroNames.map((macroKeys) => {
    const toFind = danceToFind(macroKeys);
    const newMacro = macroMap[macroKeys];
    const matchCount = keymapC.split(toFind).length - 1;
    if (matchCount !== newMacro.expectedReplacements) {
      console.error(toFind);
      throw new Error(
        `Found ${matchCount} instances of the ${macroKeys} macro but expected ${newMacro.expectedReplacements} instances!  Check your config and set the proper value in newMacro()`
      );
    }
    return matchCount;
  });

  const newConfig = macroNames.reduce((config, macroKeys, index) => {
    const toFind = danceToFind(macroKeys);
    const newMacro = macroMap[macroKeys];
    const macro = "SEND_STRING(" + newMacro.build() + ")";

    if (!macroKeys.startsWith('dance_')) {
      for (let i = 0; i < matchCounts[index]; i++) {
        console.log("Replacing \n" + toFind + "\nwith\n" + macro);
        config = config.replace(toFind, macro);
      }
    } else {
      const [_, step, keys] = macroKeys.split("_");
      const newMacro = macroMap[macroKeys];
      const replacement = "case " + DANCES[step] + ": " + macro + "; break;";
      const toFindReset = "case " + DANCES[step] + ": unregister_code16(KC_" + keys + "); break;";
      const replacementReset = "case " + DANCES[step] + ": break;";

      for (let i = 0; i < newMacro.expectedReplacements; i++) {
        console.log("Replacing \n" + toFind + "\nwith\n" + replacement);
        config = config.replace(toFind, replacement);

        console.log("Replacing \n" + toFindReset + "\nwith\n" + replacementReset);
        config = config.replace(toFindReset, replacementReset);
      }
    }
    return config;
  }, keymapC);

  return newConfig;
};
