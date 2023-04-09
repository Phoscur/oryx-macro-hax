import { newMacro, processAll } from "./macros";

const MACROS_DIR = "../macros/";

export default async function main() {
  const layoutFolder = process.argv[2] || process.env.LAYOUT_FOLDER;
  const sourceDir = `./layout_src/${layoutFolder}/keymap.c`;
  console.log("Keymap Source: " + sourceDir);

  const m = await import(MACROS_DIR + "phoscur");

  processAll(m.prepare(newMacro).macroExtensions, sourceDir);
}

if (typeof require !== 'undefined' && require.main === module) {
  main();
}