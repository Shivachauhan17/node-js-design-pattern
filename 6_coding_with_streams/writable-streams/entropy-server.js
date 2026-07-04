import { createServer } from "node:http";
import Chance from "chance";

const chance=Chance()
const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });

  do {
    res.write(`${chance.string()}\n`);
  } while (chance.bool({ likelihood: 95 }));
  res.end("\n\n");
  res.on("finish", () => console.log("All data sent"));
});

const port = 3000;

server.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
