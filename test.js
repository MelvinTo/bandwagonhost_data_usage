const index = require('./index.js');

index.handler().then((result) => {
  console.log(result);
  process.exit(0);
})