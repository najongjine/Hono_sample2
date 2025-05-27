import puppeteer from "puppeteer-extra";
//@ts-ignore
import StealthPlugin from "puppeteer-extra-plugin-stealth";
//@ts-ignore
import moment from "moment-timezone";
import * as crawlTypes from "./crawl_types";
//@ts-ignore
puppeteer.use(StealthPlugin());

/** 메인화면 상단 BEST 제품 목록 */
const fetchOpenGraphData = async (url: string) => {
  try {
    //@ts-ignore
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //await page.setBypassCSP(true); // HTTP/1.1 프로토콜 강제
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    );
    await page.goto(url, { waitUntil: "networkidle2" });

    // OG 메타데이터 추출
    const ogTitle = await page.$eval('meta[property="og:title"]', (elem) => elem.getAttribute("content"));
    const ogDescription = await page.$eval('meta[property="og:description"]', (elem) => elem.getAttribute("content"));
    const ogImage = await page.$eval('meta[property="og:image"]', (elem) => elem.getAttribute("content"));
    const totalPrice = await page.evaluate(() => {
      const spanElement = document.querySelector<HTMLSpanElement>("span.total-price");
      return spanElement ? spanElement.innerText.trim() : "";
    });

    await browser.close();

    return { ogTitle, ogDescription, ogImage, totalPrice };
    //return { ogTitle };
  } catch (error) {
    console.error("Error fetching Open Graph data:", error);
    return {};
  }
};
const crawlCoupang = async (baseUrl) => {
  try {
    //@ts-ignore
const browser = await puppeteer.launch({
    headless: false, // headless: 'old' 도 가능
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });
    const page = await browser.newPage();
    // User-Agent 설정
    await page.setUserAgent(
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
);
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => false,
  });
});

    let currentPage = 1;
    let hasNextPage = true;
    const allProducts: crawlTypes.coupangCrawlType[] = []; // 모든 제품 정보를 저장할 배열

    while (currentPage<=2) {
      const url = `${baseUrl}${currentPage}`;
      console.log(`Scraping page: ${currentPage}`);
      await page.goto(url, { waitUntil: "networkidle2" });

      const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll("#productList > li");
        const productList: any[] = [];

        productElements.forEach((product) => {
          const product_id = product.getAttribute("data-product-id");
          const image_url = (product.querySelector("img") as HTMLImageElement)?.src;
          const title = (product.querySelector(".name") as HTMLElement)?.innerText;
          let original_price = (product.querySelector(".base-price") as HTMLElement)?.innerText;
          original_price = String(original_price).replace(/\D/g, "");
          let discount_rate = (product.querySelector(".discount-percentage") as HTMLElement)?.innerText;
          discount_rate = String(discount_rate).replace(/\D/g, "");
          let discounted_price = (product.querySelector(".price-value") as HTMLElement)?.innerText;
          discounted_price = String(discounted_price).replace(/\D/g, "");
          const rating = (product.querySelector(".rating") as HTMLElement)?.innerText;
          let review_count = (product.querySelector(".rating-total-count") as HTMLElement)?.innerText;
          review_count = String(review_count).replace(/\D/g, "");
          if (!+review_count) (review_count as any) = 0;
          const detail_page_url = (product.querySelector("a") as HTMLAnchorElement)?.href;
          let _data = {} as crawlTypes.coupangCrawlType;
          _data.product_id = product_id;
          _data.image_url = image_url;
          _data.title = title;
          _data.original_price = Number(original_price) ?? 0;
          _data.discount_rate = Number(discount_rate) ?? 0;
          _data.discounted_price = Number(discounted_price) ?? 0;
          _data.rating = Number(rating) ?? 0;
          _data.review_count = Number(review_count) ?? 0;
          _data.detail_page_url = detail_page_url;
          productList.push(_data);
        });
        return productList;
      });
      allProducts.push(...products);

      // 다음 페이지 존재 여부 확인
      const nextPageExists = await page.evaluate(() => {
        const nextPageButton = document.querySelector(".icon.next-page");
        if (nextPageButton) {
          (nextPageButton as HTMLElement).click();
          return true;
        }
        return false;
      });

      hasNextPage = nextPageExists;
      if (hasNextPage) {
        // 페이지가 로드될 시간을 기다립니다.
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        currentPage++;
      }
    }
    await browser.close();
    return allProducts;
  } catch (error) {
    console.error("Error fetching Open Graph data:", error);
    return [] as crawlTypes.coupangCrawlType[];
  }
};
export default { fetchOpenGraphData, crawlCoupang };
