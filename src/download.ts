import axios from "axios";
import { existsSync } from "fs";
import { join } from "path";
import unzipper from "unzipper";

const ORYX_GRAPHQL_URL = "https://oryx.zsa.io/graphql";

export async function getKeymapSourceLink(hashId: string, revisionId = "latest"): Promise<string> {
    const query = `
    query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
        layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
            revision {
                zipUrl
            }
        }
    }`;
    type LayoutZipUrlData = {
        data: {
            data: {
                layout: {
                    revision: {
                        zipUrl: string,
                    },
                },
            },
        },
    };
    const { data } = await axios.post<unknown, LayoutZipUrlData>(ORYX_GRAPHQL_URL, {
        operationName: "getLayout",
        variables: {
            hashId,
            geometry: "moonlander",
            revisionId,
        },
        query,
    });
    return data.data.layout.revision.zipUrl;
}

export async function unzipKeymapSource(url:string , path: string): Promise<void> {
    // I've tried to type this with pipeTo ReadableStream, but it does not work
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axios.get(url, { responseType: "stream" });
    const unzip = unzipper.Extract({ path });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return data.pipe(unzip).promise();
}

export async function downloadKeymapSource(layoutHashId: string, path: string) {
    const zipUrl = await getKeymapSourceLink(layoutHashId);
    await unzipKeymapSource(zipUrl, path);
    console.log(
        `Downloaded layout "${layoutHashId}" to ${path} (from ${zipUrl}).`,
    );
}

if (typeof require !== "undefined" && require.main === module) {
    const hashId = process.argv[2] || process.env.LAYOUT_ID;
    const layoutFolder = process.argv[3] || process.env.LAYOUT_FOLDER;
    const parentFolder =
        process.argv[4] || process.env.LAYOUT_SRC || "./layout_src";
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    downloadKeymapSource(hashId, parentFolder).then(() => {
        if (!existsSync(join(parentFolder, layoutFolder))) {
            console.warn(
                `WARNING: Please check your environment: configured LAYOUT_FOLDER was not found: ${parentFolder}/${layoutFolder}`,
            );
        } else {
            console.log("Unpacked folder:", layoutFolder);
        }
    });
}
