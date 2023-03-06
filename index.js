const express = require('express');
const app = express();
const cors = require('cors');
const NodeCache = require("node-cache");
const { getInstances } = require('./api/Server')
const { getDatabases } = require('./api/Database')

const cache = new NodeCache({ stdTTL: 600 });
app.use(cors());

app.get('/instances', async (req, res) => {
  let instances = cache.get('instances');
  if (!instances) {
    instances = await getInstances();
    cache.set('instances', instances);
  }
  res.json({ instances });
});

app.get('/databases', async(req, res) => {
    let databases = cache.get('databases');
    if (!databases) {
      databases = await getDatabases();
      cache.set('databases', databases);
    }
    res.json({ databases });
  });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
