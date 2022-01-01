
import axios from 'axios'
import unzipper from 'unzipper'

const ORYX_GRAPHQL_URL = 'https://oryx.zsa.io/graphql'

export async function getSourceLink(layoutName, revisionId = 'latest') {
  const query = `
  query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
      Layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
        ...LayoutData
      }
    }

  fragment LayoutData on Layout {
    revision {
      ...RevisionData
    }
  }

  fragment RevisionData on Revision {
    zipUrl
  }
`;
  const { data } = await axios.post(ORYX_GRAPHQL_URL, {
    operationName: 'getLayout',
    variables: {
        hashId: layoutName,
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


export async function downloadKeymapSource(layoutName, path) {
  const zipUrl = await getSourceLink(layoutName)
  await unzipKeymapSource(zipUrl, path)
  console.log('Downloaded layout', layoutName, 'from', zipUrl)
}

if (typeof require !== 'undefined' && require.main === module) {
  downloadKeymapSource(process.env.LAYOUT || 'PqjlE', process.env.LAYOUT_DIR || './test/neophil')
}
