import express, { Request, Response } from "express";
import path from "node:path";
import cors from "cors";

import routes from "./routes/index";
import errorMiddleware from "./middleware/errorMiddleware";
import crossOriginOpenerPolicyMiddleware from "./middleware/crossOriginOpenerPolicyMiddleware";

// process.cwd() = repo root when started via `node server/node/dist/src/server.js`
// __dirname-relative paths shift between dev (src/) and prod (dist/src/) layouts
const CLIENT_STATIC_DIRECTORY =
  process.env.CLIENT_STATIC_DIRECTORY ||
  path.join(process.cwd(), "client");

const WELL_KNOWN_STATIC_DIRECTORY =
  process.env.WELL_KNOWN_STATIC_DIRECTORY ||
  path.join(process.cwd(), ".well-known");

const app = express();

app.use(crossOriginOpenerPolicyMiddleware);
app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/client", express.static(CLIENT_STATIC_DIRECTORY));
app.use("/.well-known", express.static(WELL_KNOWN_STATIC_DIRECTORY));

/* ######################################################################
 * Entry point for client examples containing HTML, JS, and CSS
 * ###################################################################### */

app.get("/", (_request: Request, response: Response) => {
  response.redirect("/client/index.html");
});

app.use(errorMiddleware);

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
// Render (and most PaaS) require binding to 0.0.0.0, not localhost
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

app.listen({ port, hostname }, async () => {
  console.log(`Node.js web server listening at: http://${hostname}:${port}`);
  await setupNgrokForHTTPS(port);
});

async function setupNgrokForHTTPS(port: number) {
  const { NGROK_AUTHTOKEN } = process.env;

  if (!NGROK_AUTHTOKEN) {
    return;
  }

  try {
    const ngrok = await import("@ngrok/ngrok");

    const listener = await ngrok.connect({
      addr: port,
      authtoken: NGROK_AUTHTOKEN,
    });

    console.log(`Ingress secure tunnel established at: ${listener.url()}`);
  } catch (error) {
    console.error("error connecting to ngrok:", error);
  }
}
