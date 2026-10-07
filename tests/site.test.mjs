import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { load } from 'cheerio';

const $ = load(readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8'));

test('introduces the correct person and provides working internal navigation', () => {
  assert.match($('h1').text(), /Andi Rayka/);
  assert.match($('main').text(), /Senior React Native Developer/);
  assert.match($('.wordmark').attr('aria-label'), /^ar\./);
  for (const link of $('a[href^="#"]').toArray()) {
    const id = $(link).attr('href').slice(1);
    assert.equal($(`[id="${id}"]`).length, 1, `missing target: ${id}`);
  }
});

test('ABBA is a scheduling-system story, never a mobile-app claim', () => {
  const story = $('#abba');
  assert.equal(story.length, 1);
  assert.match(story.text(), /scheduling system/i);
  assert.match(story.text(), /~7 min/);
  assert.match(story.text(), /~20 sec/);
  assert.doesNotMatch(story.text(), /React Native|Expo|mobile app|cross-platform/i);
  assert.equal(story.find('img').length, 0);
});

test('CV and public contact destinations are correct and phone stays private', () => {
  assert.ok($('a[href="https://docs.google.com/document/d/1Ax7kl511fckpd-HKFmZGoxAjrS9SAg8m/edit"]').length);
  for (const href of ['mailto:andi.rayka@gmail.com', 'https://github.com/andirayka', 'https://www.linkedin.com/in/andirayka/']) {
    assert.ok($(`a[href="${href}"]`).length, href);
  }
  assert.equal($('a[href^="tel:"]').length, 0);
  assert.doesNotMatch($('body').text(), /08997145164|Hypercal|NeoPay|LetsApp/);
});

test('content needs no JavaScript, all project details remain natively accessible', () => {
  assert.equal($('script:not([type="application/ld+json"])').length, 0);
  assert.equal($('details').length, 3);
  assert.equal($('details > summary').length, 3);
  assert.equal($('form').length, 0);
  for (const image of $('img').toArray()) {
    assert.ok($(image).attr('alt'));
    assert.ok(Number($(image).attr('width')) > 0);
    assert.ok(Number($(image).attr('height')) > 0);
  }
});
