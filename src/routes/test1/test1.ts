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

// 텍스트 임베딩 생성 예시
router.post('/embed', async c => {
  const body = await c?.req?.json();
  const texts=String(body?.texts??"테스트 문장 입니다");
  console.log(texts)
  if (!texts) {
    return c.json({ error: 'texts must be a non-empty string array' }, 400)
  }

  const apiKey = process.env.NOMIC_API_KEY
  if (!apiKey) return c.json({ error: 'NOMIC_API_KEY missing' }, 500)

  // Nomic Embed Text 엔드포인트
  const res = await fetch('https://api-atlas.nomic.ai/v1/embedding/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 핵심: Bearer 헤더에 API Key
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      // 최신 문서 기준: model / input 형식 (문서의 예제와 유사)
      // texts 배열을 그대로 보내는 버전도 존재합니다. (문서/SDK에 따라 payload 이름이 다를 수 있어 이 구조가 보편적입니다)
      texts: [texts],
      model: 'nomic-embed-text-v1.5' // 혹은 v1 등
    })
  })

  if (!res.ok) {
    const errText = await res.text()
    return c.json({ error: 'nomic api failed', status: res.status, details: errText }, 500)
  }

  const data = await res.json()
  return c.json(data)
})

export default router;
