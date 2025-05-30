import { serve } from "@hono/node-server";
import { Hono } from "hono";
import * as dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

/** import routes */
import test1 from "./routes/test1/test1.js";
import crawl from "./routes/crawl/crawl_route.js";
import imagebb from "./routes/imagebb/imagebb.js";
/** import routes END */

const app = new Hono();

app.get("/", (c) => {
  return c.json("Hello Hono!");
});

app.route("/test1", test1);
app.route("/crawl", crawl);
app.route("/imagebb", imagebb);

app.onError((err, c) => {
  return c.json({ success: false, data: null, code: "global_err", message: `${err?.message ?? "!!!_global_err"}` });
});

const hono_port = Number(process?.env?.HONO_PORT ?? 3005);
serve(
  {
    fetch: app.fetch,
    port: hono_port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`process.env.NODE_ENV :${process.env.NODE_ENV}`);
  }
);
