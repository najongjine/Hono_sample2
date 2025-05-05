import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import { TStores } from "../../entities/TStores";

const test1 = new Hono();

test1.get("/", async (c) => {
  try {
    let a: any;
    return c.json({ success: true, data: null, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});
test1.post("/test1-post", async (c) => {
  try {
    const body = await c?.req?.json();
    return c.json({ success: true, data: body, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1_post", message: `!!! {error?.message ?? "!!! test1_post"}` });
  }
});
test1.get("/stores", async (c) => {
  try {
    const storeRepository = AppDataSource.getRepository(TStores);
    const stores = await storeRepository.find();
    return c.json({ success: true, data: stores, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1_stores", message: `!!! ${error?.message ?? "!!! test1_stores"}` });
  }
});
export default test1;
