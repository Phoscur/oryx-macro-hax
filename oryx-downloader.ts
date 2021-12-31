
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
async function getSourceLink(layoutName, revisionId = 'latest') {
  const query = `
  query getLayout($hashId: String!, $revisionId: String!, $geometry: String) {
      Layout(hashId: $hashId, geometry: $geometry, revisionId: $revisionId) {
        ...LayoutData
        __typename
      }
    }

  fragment LayoutData on Layout {
    privacy
    geometry
    hashId
    parent {
      hashId
      __typename
    }
    tags {
      id
      hashId
      name
      __typename
    }
    title
    user {
      annotationPublic 
      name
      hashId
      pictureUrl
    __typename
    }
    revision {
      ...RevisionData
      __typename
    }
    __typename
  }

  fragment RevisionData on Revision {
    aboutIntro
    aboutOutro
    createdAt
    hashId
    hexUrl
    model
    title
    config
    swatch
    zipUrl
    qmkVersion
    qmkUptodate
    layers {
      builtIn
      hashId
      keys
      position
      title
      color
      __typename
    }
    __typename
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
  console.log('Zip url:', data.data.Layout.revision.zipUrl)
  return data.data.Layout.revision.zipUrl
}

getSourceLink('PqjlE').then(getSource)