import { Hono } from "hono";
import imgbbUploader from "imgbb-uploader";
import * as fs from "fs";

const router = new Hono();

router.post("/upload", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const body = await c.req.parseBody();

    const files = body["file[]"];

    if (!files) {
      result.success = false;
      result.message = `no file`;
      return c.json(result);
    }

    // files가 배열이 아닐 경우 배열로 변환
    const fileArray = Array.isArray(files) ? files : [files];
    let imagebbResponse = [];

    for (const file of fileArray) {
      if (!(file instanceof File)) {
        result.success = false;
        result.message = `invalid file`;
        return c.json(result);
      }

      // 브라우저 파일 객체를 binary 형식으로 변환
      const arrayBuffer = await file.arrayBuffer();
      // binary 형식을 Node.js Buffer 객체로 변환
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString("base64");

      const response = await imgbbUploader({
        apiKey: process.env.IMGBB_API_KEY,
        base64string: base64Image,
        name: file.name,
      });

      imagebbResponse.push(response?.url ?? "");
    }

    return c.json({ imagebbResponse: imagebbResponse });
  } catch (error) {
    result.success = false;
    result.message = `!!! imagebb upload. ${error?.message}`;
    return c.json(result);
  }
});

export default router;
