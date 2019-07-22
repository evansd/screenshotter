#!/usr/bin/env node
/* jshint esversion: 9 */

const puppeteer = require('puppeteer');

const config = {
  url: 'https://openprescribing.net/measure/lpzomnibus/ccg/02N/',
  selector: '#lpzomnibus-with-title',
  // How long to wait for the selector to match something
  selectorTimeout: 20000,
  // Delay after the selector matches to give the element time to finish
  // animating
  selectorDelay: 1000,
  pageViewport: {width: 800, height: 600, deviceScaleFactor: 1},
  // If the selected element exists but has a size radically different from
  // what we're expecting then it's better to error out than overwrite the
  // previous good image
  minSize: {width: 50, height: 50},
  maxSize: {width: 1000, height: 1000},
  outputPath: 'docs/demo/chart.png'
};

// Getting the Chrome sandbox running correctly on the currently available
// Circle CI images is a bit fiddly, but given that we trust the pages we're
// screenshotting we can just disable it with these flags. For more information
// see:
// https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
const CHROME_FLAGS = ['--no-sandbox', '--disable-setuid-sandbox'];


// Make sure we exit with status > 0 on all unhandled errors
process.on('unhandledRejection', error => { throw error; });


puppeteer.launch({args: CHROME_FLAGS}).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport(config.pageViewport);
  await page.goto(config.url);
  await page.waitForSelector(config.selector, {timeout: config.selectorTimeout});
  await sleep(config.selectorDelay);
  const element = await page.$(config.selector);
  const bbox = await element.boundingBox();
  if ( ! dimensionsFit(bbox, config.minSize, config.maxSize)) {
    throw `Element has unexpected size: ${bbox.width} x ${bbox.height}`;
  }
  await element.screenshot({path: config.outputPath});
  await browser.close();
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function dimensionsFit(size, minSize, maxSize) {
  for (const dim of ['width', 'height']) {
    if (size[dim] > maxSize[dim] || size[dim] < minSize[dim]) {
      return false;
    }
  }
  return true;
}
