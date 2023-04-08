
import axios from 'axios'
import { existsSync } from 'fs'
import { join } from 'path'
import unzipper from 'unzipper'

const ORYX_GRAPHQL_URL = 'https://oryx.zsa.io/graphql'


export async function getKeymapSourceLink(hashId, revisionId = 'latest') {
  const query = `
query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
  layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
    revision {
      zipUrl
    }
  }
}`
  const { data } = await axios.post(ORYX_GRAPHQL_URL, {
    operationName: 'getLayout',
    variables: {
        hashId,
        geometry: 'moonlander',
        revisionId,
    },
    query,
  })
  return data.data.layout.revision.zipUrl
}

export async function unzipKeymapSource(url, path) {
  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream'
  })
  const unzip = unzipper.Extract({ path })
  return response.data.pipe(unzip).promise()
}


export async function downloadKeymapSource(layoutHashId, path) {
  const zipUrl = await getKeymapSourceLink(layoutHashId)
  await unzipKeymapSource(zipUrl, path)
  console.log(`Downloaded layout "${layoutHashId}" to ${path} (from ${zipUrl}).`)
}

if (typeof require !== 'undefined' && require.main === module) {
  const hashId = process.argv[2] || process.env.LAYOUT_ID
  const parentFolder = process.argv[3] || process.env.LAYOUT_DIR || './layout_src'
  const layoutFolder = process.argv[4] || process.env.LAYOUT_FOLDER
  downloadKeymapSource(hashId, parentFolder).then(() => {
    if (!existsSync(join(parentFolder, layoutFolder))) {
      console.warn(`WARNING: Please check your environment: configured LAYOUT_FOLDER was not found: ${parentFolder}/${layoutFolder}`);
    } else {
      console.log('Unpacked folder:', layoutFolder);
    }
  });
  
}
