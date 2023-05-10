import axios from "axios";
import { existsSync } from "fs";
import { join } from "path";
import unzipper from "unzipper";

const ORYX_GRAPHQL_URL = "https://oryx.zsa.io/graphql";

export async function getKeymapSourceLink(
    hashId: string,
    revisionId = "latest",
) {
    const query = `
    query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
        layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
            title
            geometry
            revision {
                zipUrl
            }
        }
    }`;
    type LayoutZipUrlData = {
        data: {
            layout: {
                title: string;
                geometry: string;
                revision: {
                    zipUrl: string;
                };
            };
        };
    };
    const {
        data: {
            data: {
                layout: {
                    title,
                    geometry,
                    revision: { zipUrl },
                },
            },
        },
    } = await axios.post<LayoutZipUrlData>(ORYX_GRAPHQL_URL, {
        operationName: "getLayout",
        variables: {
            hashId,
            geometry: "moonlander",
            revisionId,
        },
        query,
    });
    return {
        title,
        geometry,
        zipUrl,
    };
}

export async function unzipKeymapSource(
    url: string,
    path: string,
): Promise<void> {
    // I've tried to type this with pipeTo ReadableStream, but it does not work
    const { data } = await axios.get(url, { responseType: "stream" });
    const unzip = unzipper.Extract({ path });
    return data.pipe(unzip).promise();
}

export async function downloadKeymapSource(layoutHashId: string, path: string) {
    const { title, geometry, zipUrl } = await getKeymapSourceLink(layoutHashId);
    const folderName = `${geometry}_${title
        .toLowerCase()
        .replace(" ", "-")}_source`;
    // TODO? other transformed chars? console.log(`Predicted folder name: ${folderName}`, geometry, title);
    await unzipKeymapSource(zipUrl, path);
    console.log(
        `Downloaded layout "${title}" [${layoutHashId}] to ${path} (from ${zipUrl}).`,
    );
    return folderName;
}

if (typeof require !== "undefined" && require.main === module) {
    const hashId = process.argv[2] || process.env.LAYOUT_ID;
    const layoutFolder = process.argv[3] || process.env.LAYOUT_FOLDER;
    const parentFolder =
        process.argv[4] || process.env.LAYOUT_SRC || "./layout_src";
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    downloadKeymapSource(hashId, parentFolder).then((folderName) => {
        if (!existsSync(join(parentFolder, folderName))) {
            console.error(
                `Expected folder "${folderName}" in the archive was not found!`,
            );
        } else {
            console.log("Unpacked folder:", folderName);
            // TODO save LAYOUT_FOLDER
            if (folderName !== layoutFolder) {
                console.warn(
                    `Given layout folder name "${layoutFolder}" does not match "${folderName}"`,
                );
            }
            process.exit(0);
        }
        if (!existsSync(join(parentFolder, layoutFolder))) {
            console.warn(
                `Please check your environment: configured LAYOUT_FOLDER was not found: ${parentFolder}/${layoutFolder}`,
            );
        } else {
            console.log("Unpacked folder:", layoutFolder);
        }
    });
}
