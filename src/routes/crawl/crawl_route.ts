import { Hono } from "hono";
import axios from "axios";
import crawlService from "./crawl.service"

const router = new Hono();

router.get("/crawl_test1", async (c) => {
  try {
    let url=`https://www.coupang.com/np/search?component=&q=cpu&channel=user`
    let data=await crawlService.crawlCoupang(url);
    return c.json({ success: true, data: data, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `!!! ${error?.message ?? "!!! test1"}` });
  }
});



export default router;
