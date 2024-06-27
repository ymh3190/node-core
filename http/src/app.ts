import { createServer, IncomingMessage, ServerResponse } from "http";
import { BlockList } from "net";
const blockList = new BlockList();

const blockAddrs: string[] = [];

const server = createServer();

const signupPath = "/api/v1/auth/signup";
const signinPath = "/api/v1/auth/signin";

const blockPath = "/api/v1/blocks";

server.on("request", (req: IncomingMessage, res: ServerResponse) => {
  for (const blockAddr of blockAddrs) {
    if (blockList.check(blockAddr)) {
      try {
        throw new Error("Unauthorized to access this route");
      } catch (error: any) {
        console.log(error);
        res.writeHead(403, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: error.message }));
      } finally {
        res.end();
        return;
      }
    }
  }

  if (req.url === signupPath && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const parsed = JSON.parse(body);
      const { username, password } = parsed;

      if (!username || !password) {
        try {
          throw new Error("Provide username and password");
        } catch (error: any) {
          console.log(error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: error.message }));
        } finally {
          res.end();
          return;
        }
      }

      res.writeHead(201, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Signup" }));
      res.end();
      return;
    });
    return;
  }

  if (req.url === signinPath && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const parsed = JSON.parse(body);
      const { username, password } = parsed;

      if (!username || !password) {
        try {
          throw new Error("Provide username and password");
        } catch (error: any) {
          console.log(error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: error.message }));
        } finally {
          res.end();
          return;
        }
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Signin" }));
      res.end();
      return;
    });
    return;
  }

  if (req.url === blockPath && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const parsed = JSON.parse(body);
      const { ip } = parsed;
      if (!ip) {
        try {
          throw new Error("Provide ip");
        } catch (error: any) {
          console.log(error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ message: error.message }));
        } finally {
          res.end();
          return;
        }
      }
      blockAddrs.push(ip);
      blockList.addAddress(ip);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ data: blockAddrs }));
      res.end();
      return;
    });
    return;
  }
});

const port = 3000;
(() => {
  try {
    server.listen(port, () => {
      console.log(`Server listening port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
