import prompt from "prompts";
import storage, { LocalStorage } from "node-persist";
import _yargs from "yargs";
import { hideBin } from "yargs/helpers";
import config from "../package.json";
import { downloadKeymapSource, getKeymapSourceLink } from "./download";
import processMacros from "./process";
import { readdir, lstat } from "fs/promises";
import { join } from "path";
const yargs = _yargs(hideBin(process.argv));

const UNSPECIFIED = "unspecified";
const STORAGE_FOLDER = "storage";
const LAYOUT_SRC_DEFAULT = "./layout_src";
const { USER_NAME, LAYOUT_ID, LAYOUT_FOLDER, LAYOUT_SRC } = process.env;

declare module "prompts" {
    // asking for types to be given: https://github.com/terkelg/prompts/issues/388#issuecomment-1542744816
    function override(args: unknown): void;
}

export async function main(storage: LocalStorage) {
    await storage.init({ dir: STORAGE_FOLDER });
    //TODO? check existing cache
    const values = await storage.values();
    console.log("Storage Keys:", values.length);

    const argv = await yargs
        .scriptName(config.name)
        .usage("$0 (npm start) <cmd> [args]")
        .command(
            "get [layoutID]",
            "- download a layout",
            (yargs) => {
                yargs.positional("layoutID", {
                    type: "string",
                    default: UNSPECIFIED,
                    describe:
                        "Identifier of the layout, find it in the URL: https://configure.zsa.io/<geometry>/layouts/<layoutID>/latest/0",
                });
            },
            async function (argv) {
                const id = await storage.getItem("layoutID");
                console.log(
                    "Layout ID:",
                    argv.layoutID,
                    "ENV:",
                    LAYOUT_ID,
                    "Storage:",
                    id,
                );
                if (!argv.layoutID || argv.layoutID === UNSPECIFIED) {
                    if (!LAYOUT_ID && !id) {
                        console.error("No Layout Identifier given or saved!");
                        process.exit(1);
                    }
                    argv.layoutID = id;
                    if (LAYOUT_ID) {
                        // env is preferred over storage
                        argv.layoutID = LAYOUT_ID;
                    }
                }
                await storage.setItem("layoutID", argv.layoutID);
            },
        )
        .command(
            "process [username]",
            "- apply macros/<username>.ts",
            (yargs) => {
                yargs.positional("username", {
                    type: "string",
                    default: UNSPECIFIED,
                    describe: "Github username",
                });
            },
            async function (argv) {
                const username = await storage.getItem("username");
                console.log(
                    "Username:",
                    argv.username,
                    "ENV:",
                    USER_NAME,
                    "Storage:",
                    username,
                );
                if (!argv.username || argv.username === UNSPECIFIED) {
                    if (!USER_NAME && !username) {
                        console.error("No username given or saved!");
                        process.exit(1);
                    }
                    argv.username = username;
                    if (USER_NAME) {
                        // env is preferred over storage
                        argv.username = USER_NAME;
                    }
                }
                await storage.setItem("username", argv.username);
            },
        )
        .help().argv;
    prompt.override(argv);
    console.log("ARGV", argv);
    if (argv._.includes("get")) {
        await downloadKeymapSource(
            argv.layoutID as string,
            LAYOUT_SRC || LAYOUT_SRC_DEFAULT,
        );
    }
    async function getLayoutFolder() {
        let layoutFolder =
            LAYOUT_FOLDER ||
            ((await storage.getItem("layoutFolder")) as string);
        if (!layoutFolder) {
            const layoutID: string =
                LAYOUT_ID ||
                argv.layoutID ||
                (await storage.getItem("layoutID"));
            if (!layoutID) {
                console.error(
                    "No LAYOUT_FOLDER given, also no LAYOUT_ID found.",
                );
                process.exit(1);
            }
            const { folderName } = await getKeymapSourceLink(layoutID);
            layoutFolder = folderName;
            await storage.setItem("layoutFolder", layoutFolder);
        }
        return layoutFolder;
    }

    async function checkLayoutFolder(folder: string) {
        try {
            const stat = await lstat(
                join(LAYOUT_SRC || LAYOUT_SRC_DEFAULT, folder),
            );
            return stat.isDirectory();
        } catch (err) {
            return false;
        }
    }
    if (argv._.includes("process")) {
        const layoutFolder = await getLayoutFolder();
        if (!(await checkLayoutFolder(layoutFolder))) {
            console.error(`Layout Folder "${layoutFolder}" not found!`);
            const folders = (
                await readdir(LAYOUT_SRC || LAYOUT_SRC_DEFAULT)
            ).filter((f: string) => f.includes("_source"));
            if (!folders.length) {
                console.log(`Run the "get" command first or manually download a layout into ${LAYOUT_SRC || LAYOUT_SRC_DEFAULT}!`);
                process.exit(1);
            } else {
                console.log("Candidates:", folders.map(f => `- ${f}`).join("\n"));
                console.log("You can manually overwrite your environment config with the correct one:");
                console.log(`- e.g. LAYOUT_FOLDER=${folders[0]}`);
                console.warn("Please open an issue to support the special chars in your layout title!?");
                process.exit(1);
            }
        }
        await processMacros(
            argv.username as string,
            layoutFolder,
            LAYOUT_SRC || LAYOUT_SRC_DEFAULT,
        );
    }
    // TODO prompts for layoutID & username

    const layoutFolder = await getLayoutFolder();
    console.log("Folder", layoutFolder, await checkLayoutFolder(layoutFolder) ? "found." : "not found!");
    const files = await readdir(join(LAYOUT_SRC || LAYOUT_SRC_DEFAULT, layoutFolder));
    console.log(
        files.includes("keymap.c") ? "Keymap File found." : "No Keymap File found!",
    );
    console.log("Use --help overview options!");
}

if (typeof require !== "undefined" && require.main === module) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    main(storage);
}
