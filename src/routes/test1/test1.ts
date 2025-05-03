import { Hono } from "hono";

const test1 = new Hono();

test1.get("/", async (c) => {
  try {
    let a: any;
    let b = a.a.a;
    return c.json({ success: true, data: null, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `${error?.message ?? "!!! test1"}` });
  }
});
test1.post("/test1-post", async (c) => {
  try {
    const body = await c?.req?.json();
    return c.json({ success: true, data: body, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1_post", message: `${error?.message ?? "!!! test1_post"}` });
  }
});

export default test1;
