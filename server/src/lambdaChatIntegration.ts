import puppeteer from 'puppeteer';

export async function generateContentWithLambdaChat(prompt: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://lambda.chat/chatui/');
    await page.waitForSelector('textarea[placeholder="Send a message"]');

    // Type the prompt
    await page.type('textarea[placeholder="Send a message"]', prompt);
    await page.keyboard.press('Enter');

    // Wait for the response
    await page.waitForSelector('.message:last-child .message-content');

    // Get the generated content
    const content = await page.$eval('.message:last-child .message-content', el => el.textContent);

    return content || 'Failed to generate content';
  } finally {
    await browser.close();
  }
}