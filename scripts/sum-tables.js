const { chromium } = require('playwright');

const urls = [
  'https://sanand0.github.io/tdsdata/js_table/?seed=19',
  'https://sanand0.github.io/tdsdata/js_table/?seed=20',
  'https://sanand0.github.io/tdsdata/js_table/?seed=21',
  'https://sanand0.github.io/tdsdata/js_table/?seed=22',
  'https://sanand0.github.io/tdsdata/js_table/?seed=23',
  'https://sanand0.github.io/tdsdata/js_table/?seed=24',
  'https://sanand0.github.io/tdsdata/js_table/?seed=25',
  'https://sanand0.github.io/tdsdata/js_table/?seed=26',
  'https://sanand0.github.io/tdsdata/js_table/?seed=27',
  'https://sanand0.github.io/tdsdata/js_table/?seed=28'
];

function sumNumbersInText(text) {
  const matches = text.match(/-?\d+(?:\.\d+)?/g);
  if (!matches) {
    return 0;
  }
  return matches.reduce((acc, token) => acc + Number(token), 0);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  let grandTotal = 0;

  try {
    for (const url of urls) {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

      const tableTexts = await page.$$eval('table', (tables) =>
        tables.map((table) => table.innerText)
      );

      const pageTotal = tableTexts.reduce(
        (acc, tableText) => acc + sumNumbersInText(tableText),
        0
      );

      grandTotal += pageTotal;
      console.log(`Page total for ${url}: ${pageTotal}`);

      await page.close();
    }

    console.log(`FINAL_TOTAL=${grandTotal}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

run().catch((error) => {
  console.error('Failed to compute table sums:', error);
  process.exit(1);
});