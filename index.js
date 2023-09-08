const { default: puppeteer } = require("puppeteer");
const fs = require("fs");
const { load } = require("cheerio");

const data = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // defaultViewport: {
    //     height: 768,
    //     width: 1366
    //   }
  });

  const page = await browser.newPage();
  await page.goto("https://www.boat-lifestyle.com/");
  await page.type(
    "div.algolia-header-search-input > div > div > label > input",
    "speakers"
  );
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000);

  const productsData = [];
  const $ = load(await page.content());
  $(
    ".aa-product"
  ).each((index, element) => {
    // console.log("This is good")
    const name = $(".aa-product-title", element).text();
    const price = $(".algolia_price", element).text();
    const description = $(".feature", element).text();
    const image = $(element).find("img").attr("src");
    productsData.push({
      name: name,
      price: price,
      description: description,
      image: image,
    });
  });

  await browser.close();
  fs.writeFileSync("products.json", JSON.stringify(productsData), "utf-8");
};

data();
