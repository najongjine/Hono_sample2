import { Hono } from "hono";

const test1 = new Hono();

test1.get("/", async (c) => {
  let a: any;
  let b = a.a.a;
  return c.json("ok");
});
test1.post("/test1-post", async (c) => {
  const body = await c?.req?.json();
  const a = body?.a;
  return c.json("ok");
});

export default test1;
