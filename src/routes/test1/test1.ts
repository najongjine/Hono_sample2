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

/**
 * Phi-3-mini-4k-instruct 모델은 최대 4,000 토큰의 컨텍스트 길이를 지원합니다. 즉, 시스템 메시지, 사용자 질문, 그리고 모델이 생성할 응답을 모두 포함하여 총 토큰 수가 4,000을 초과하지 않아야 합니다.

✅ 입력 토큰 제한
입력 토큰 수: 시스템 프롬프트와 사용자 질문을 포함하여 최대 4,000 토큰까지 허용됩니다.

출력 토큰 수 (max_new_tokens): 입력 토큰 수와 출력 토큰 수의 합이 4,000을 초과하지 않도록 설정해야 합니다.

예를 들어, 입력 프롬프트가 3,000 토큰이라면, max_new_tokens를 1,000 이하로 설정해야 전체 토큰 수가 4,000을 넘지 않습니다.

⚠️ 주의사항
입력 프롬프트가 너무 길어 4,000 토큰을 초과하면, 모델은 초과된 부분을 잘라내거나 오류를 발생시킬 수 있습니다.

Hugging Face의 Inference API를 사용할 경우, 추가적인 제한이 있을 수 있으므로 공식 문서를 참고하시기 바랍니다.

✅ 토큰 수 계산 방법
토큰 수를 정확하게 계산하려면, Hugging Face의 transformers 라이브러리를 사용하여 다음과 같이 확인할 수 있습니다:
 */
router.get("/chat", async (c) => {
  const allParams = c?.req?.query();
  let message = allParams?.message ?? "한국 IT 회사에 취업하고 싶어. 어떻게 해야해?";
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
