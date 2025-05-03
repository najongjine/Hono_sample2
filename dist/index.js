import { serve } from "@hono/node-server";
import { Hono } from "hono";
/** import routes */
import test1 from "./routes/test1/test1.js";
/** import routes END */
const app = new Hono();
app.get("/", (c) => {
    return c.json("Hello Hono!");
});
app.route("/test1", test1);
const hono_port = Number(process?.env?.HONO_PORT ?? 3005);
serve({
    fetch: app.fetch,
    port: hono_port,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`process.env.NODE_ENV :${process.env.NODE_ENV}`);
});
