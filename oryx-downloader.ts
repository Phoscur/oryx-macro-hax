import fs from "fs"
import axios from "axios"
import unzipper from "unzipper"

axios({
  method: 'get',
  url: "https://oryx.zsa.io/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMW1ySlE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--7dd4521b1d18db272247e91d3829130918d98039/moonlander_neophil-autobahn-fueled-wip_PqjlE_aVPD7.zip",
  // 'http://bit.ly/2mTM3nY',
  responseType: 'stream'
})
  .then(function (response) {
    response.data.pipe(unzipper.Extract({ path: './test/neophil' }))//fs.createWriteStream('ada_lovelace.jpg'))
  });
