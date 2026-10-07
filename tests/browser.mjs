import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const artifacts = fileURLToPath(new URL('../.amp/in/artifacts/', import.meta.url));
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto('http://localhost:4321/');
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').innerText(), 'Andi Rayka.');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}px`);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').innerText(), 'Skip to content');
    await page.keyboard.press('Enter');
    assert.ok(page.url().endsWith('#main'));
    await page.getByRole('link', { name: 'Explore my work' }).click();
    assert.ok(page.url().endsWith('#work'));
    assert.deepEqual(await page.locator('.project h3').allTextContents(), ['Ecoloop Partner', 'Mabaat', 'ABBA']);
    for (const id of ['ecoloop', 'mabaat', 'abba']) {
      const details = page.locator(`#${id} details`);
      await details.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await details.getAttribute('open'), '');
      assert.ok(await details.locator('.detail-body').isVisible());
    }
    assert.doesNotMatch(await page.locator('#abba').innerText(), /React Native|Expo|mobile app/i);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .options({ rules: { 'label-content-name-mismatch': { enabled: true } } })
      .analyze();
    assert.deepEqual(results.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), [], `accessibility at ${width}px`);
    if (width === 390 || width === 1440) {
      await page.locator('#abba').screenshot({ path: `${artifacts}abba-open-${width}.png` });
      await page.locator('#about').screenshot({ path: `${artifacts}about-${width}.png` });
      await page.locator('#contact').screenshot({ path: `${artifacts}contact-${width}.png` });
      for (const summary of await page.locator('summary').all()) await summary.click();
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${artifacts}home-${width}.png` });
      await page.screenshot({ path: `${artifacts}full-${width}.png`, fullPage: true });
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`PASS ${width}px: navigation, keyboard details, content, overflow, accessibility`);
  }
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:4321/');
  await page.locator('#abba summary').click();
  assert.ok(await page.locator('#abba .detail-body').isVisible());
  console.log('PASS JavaScript disabled: project details remain usable');
} finally {
  await browser.close();
}
