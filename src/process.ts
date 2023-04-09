import { MacroBuilder, newMacro } from "./macros";

function charStrToMacro(keys: string): MacroBuilder {
  if (keys.length < 1 || keys.length > 5) {
      throw new Error("Please check macro ID for " + keys);
  }
  let macro = newMacro();
  for (let i = 0; i < keys.length; i++) {
      macro = macro.tapKey(`X_${keys[i].toUpperCase()}`)
      if (i < keys.length - 1) {
          macro = macro.delay(100);
      }
  }
  return macro;
}

export const process = (keymapC: string, macroMap: {
  [originalMacroKeys: string]: MacroBuilder;
}): string => {
  const macroNames = Object.keys(macroMap);

  const matchCounts = macroNames.map((macroKeys) => {
    const toFind = "SEND_STRING(" + charStrToMacro(macroKeys).build() + ")";
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
    const toFind = "SEND_STRING(" + charStrToMacro(macroKeys).build() + ")";
    const newMacro = macroMap[macroKeys];
    const macro = "SEND_STRING(" + newMacro.build() + ")";
    for (let i = 0; i < matchCounts[index]; i++) {
      console.log("Replacing \n" + toFind + "\nwith\n" + macro);
      config = config.replace(toFind, macro);
    }
    return config;
  }, keymapC);

  return newConfig;
};
