const express = require("express");

const { MongoClient } = require("mongodb");

const promClient = require('prom-client');

const app = express();

// Replace the following with your Atlas connection string
console.log("hello???");

// replace the uri string with your connection string.
const uri = `${process.env.MONGOURL}`;

const client = new MongoClient(
  uri,
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);

client.connect(err => {
  if (err) {
    console.log(
      `error has occured while trying to connect to mongodb atlas ${err}`
    );
  }
  console.log("connected...");
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

/*
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connect() {
  try {
    await client.connect();
    // const db = client.db("posted");
    console.log("connected to database");

    //const collections = await db.collections()
  } catch (err) {
    console.error(`error has been found.....${err}`);
  } finally {
    client.close();
  }
}

connect();
*/

const articles = [
  {
    alt: "new image alt",
    id: 1,
    key: 1,
    title: "title",
    href:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fminecraft%2F&psig=AOvVaw1jIsHQ5y0dHluulfR2BsBV&ust=1589268814797000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIiPyuylq-kCFQAAAAAdAAAAABAD",
    subTitle: "subTitle",
    body: "body",
    link: "/blog"
  },
  {
    alt: "new image alt",
    id: 2,
    key: 2,
    title: "title2",
    href:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fminecraft%2F&psig=AOvVaw1jIsHQ5y0dHluulfR2BsBV&ust=1589268814797000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIiPyuylq-kCFQAAAAAdAAAAABAD",
    subTitle: "subTitle2",
    body: "body2",
    link: "/blog"
  },
  {
    alt: "new image alt",
    id: 3,
    key: 3,
    title: "title3",
    href:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fminecraft%2F&psig=AOvVaw1jIsHQ5y0dHluulfR2BsBV&ust=1589268814797000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIiPyuylq-kCFQAAAAAdAAAAABAD",
    subTitle: "subTitle3",
    body: "body3",
    link: "/blog"
  }
];

const metrics = registerMetrics();

app.get("/", (req, res) => {
  metrics.routesCount.inc({ route: "root" });
  res.send("Hello Node !!!!");
});

app.get("/api/blog", (req, res) => {
  metrics.routesCount.inc({ route: "blog" });
  res.send(articles);
});

app.get("/api/blog/:id", (req, res) => {
  metrics.routesCount.inc({ route: "specific_blog" });
  //get the article that matches with the url params
  const article = articles.find(
    article => article.id === parseInt(req.params.id, 0)
  );
  if (!article) {
    res.status(404).send("This article doesn't exist");
  } else {
    res.send(article);
  }
});

app.get('/metrics', (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(metrics.register.metrics());
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));

function registerMetrics() {
  const collectDefaultMetrics = promClient.collectDefaultMetrics;
  const Registry = promClient.Registry;
  const register = new Registry();
  collectDefaultMetrics({ register });
  const routesCount = new promClient.Counter({
    name: 'routes_count',
    help: 'Request count for each route',
    labelNames: ['route'],
  });
  register.registerMetric(routesCount);
  return {
    register: register,
    routesCount: routesCount,
  }
}
