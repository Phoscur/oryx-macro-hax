import { newMacro, processAll } from "./macros";

const MACROS_DIR = "../macros/";
const {
  LAYOUT_FOLDER,
  LAYOUT_SRC,
  USER_NAME,
} = process.env;
const SOURCE_DIR = `${LAYOUT_SRC}/${LAYOUT_FOLDER}/keymap.c`;

export default async function main() {  
  console.log(`Keymap Source: ${SOURCE_DIR}, User: ${USER_NAME}`);
  const m = await import(MACROS_DIR + USER_NAME);
  processAll(m.prepare(newMacro).macroExtensions, SOURCE_DIR);
}

if (typeof require !== 'undefined' && require.main === module) {
  main();
}