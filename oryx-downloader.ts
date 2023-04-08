
import axios from 'axios'
import unzipper from 'unzipper'

const ORYX_GRAPHQL_URL = 'https://oryx.zsa.io/graphql'

export async function getKeymapSourceLink(hashId, revisionId = 'latest') {
  const query = `
query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
  Layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
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
  return data.data.Layout.revision.zipUrl
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
  console.log('Downloaded layout', layoutHashId, 'from', zipUrl, 'to', path)
}

if (typeof require !== 'undefined' && require.main === module) {
  const hashId = process.argv[2] || process.env.LAYOUT_ID;
  const folder = process.argv[3] || process.env.LAYOUT_DIR;
  downloadKeymapSource(hashId, folder);
}
