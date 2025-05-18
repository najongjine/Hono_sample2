import { Hono } from "hono";
import axios from "axios";

const router = new Hono();

router.get("/", async (c) => {
  try {
    let a: any;
    return c.json({ success: true, data: null, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1", message: `${error?.message ?? "!!! test1"}` });
  }
});
router.post("/test1-post", async (c) => {
  try {
    const body = await c?.req?.json();
    return c.json({ success: true, data: body, code: "", message: `` });
  } catch (error: any) {
    return c.json({ success: false, data: null, code: "test1_post", message: `${error?.message ?? "!!! test1_post"}` });
  }
});

router.get("/chat", async (c) => {
  let message = "IT 회사에 취업하고 싶어. 어떻게 해야해?";
  console.log("HUGGINGFACE_API_KEY: ", process.env.HUGGINGFACE_API_KEY);

  try {
    const prompt = `<|system|>\n
    You are a helpful korean chatbot assistant.
    <|end|>\n
    <|user|>\n
    ${message}
    <|end|>\n
    <|assistant|>`;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.5,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data[0]?.generated_text || "응답을 생성하지 못했습니다.";
    return c.json({ reply: generatedText });
  } catch (error: any) {
    console.error("API 요청 중 오류 발생:", error.message);
    return c.json({ error: "API 요청 중 오류가 발생했습니다." }, 500);
  }
});

export default router;
