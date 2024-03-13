import chromium from "chrome-aws-lambda";



export default async function handler(req, res) {
  const { url, width,  height } = req.query;
   try {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    // executablePath: "/usr/bin/google-chrome-stable", // use this when running locally.
    headless: true,
    ignoreHTTPSErrors: true,
  });

  let page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle0" });

  await page.setViewport({ width: Number(width) || 1280, height: Number(height) || 720, deviceScaleFactor: 2 });
  const file = await page.screenshot();

  await browser?.close();

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, immutable, no-transform, s-maxage=86400, max-age=86400");
  res.status(200).end(file);
       } catch (error) {
    console.error(error);
    res.status(500).send("The server encountered an error. You may have inputted an invalid query.");
  }
}
