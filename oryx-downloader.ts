
import axios from 'axios'
import unzipper from 'unzipper'

function getSource(url) {
  axios({
    method: 'get',
    url,
    responseType: 'stream'
  })
    .then(function (response) {
      response.data.pipe(unzipper.Extract({ path: './test/neophil' }))
    });
}

const ORYX_GRAPHQL_URL = 'https://oryx.zsa.io/graphql'
async function getSourceLink(layoutName) {
  const { data } = await axios.post(ORYX_GRAPHQL_URL, {
    operationName: 'getLayout',
    variables: {
        hashId: layoutName,
        geometry: 'moonlander',
        revisionId: 'latest'
    },
    query: `query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {\n  Layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {\n    ...LayoutData\n    __typename\n  }\n}\n\nfragment LayoutData on Layout {\n  privacy\n  geometry\n  hashId\n  parent {\n    hashId\n    __typename\n  }\n  tags {\n    id\n    hashId\n    name\n    __typename\n  }\n  title\n  user {\n    annotationPublic\n    name\n    hashId\n    pictureUrl\n    __typename\n  }\n  revision {\n    ...RevisionData\n    __typename\n  }\n  __typename\n}\n\nfragment RevisionData on Revision {\n  aboutIntro\n  aboutOutro\n  createdAt\n  hashId\n  hexUrl\n  model\n  title\n  config\n  swatch\n  zipUrl\n  qmkVersion\n  qmkUptodate\n  layers {\n    builtIn\n    hashId\n    keys\n    position\n    title\n    color\n    __typename\n  }\n  __typename\n}\n`
  })
  console.log('Zip url:', data.data.Layout.revision.zipUrl)
  return data.data.Layout.revision.zipUrl
}

getSourceLink('PqjlE').then(getSource)