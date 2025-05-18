import { Hono } from "hono";
import axios from "axios";

const router = new Hono();

router.get("/", async (c) => {
  try {
    let a: any;
    return c.json({ success: true, data: null, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});
router.post("/test1-post", async (c) => {
  try {
    const body = await c?.req?.json();
    return c.json({ success: true, data: body, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1_post", message: `!!! {error?.message ?? "!!! test1_post"}` });
  }
});

export default test1;
