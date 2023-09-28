import { handler } from "./index";
import logger from './services/logger';

logger.silent = true;

it('still works', async () => {
  await handler().then((response) => {
    expect(response.statusCode).toBe(200);

    const xmldom = require('xmldom');
    const xpath = require('xpath');

    const parser = new xmldom.DOMParser();
    const root = parser.parseFromString(response.body, 'text/xml');
    const items = xpath.select('//item', root)

    logger.silent = false;
    logger.silly('Found %d items', items.length)
    items.forEach((item: any) => {
      const title = item.getElementsByTagName('title')[0].textContent;
      logger.silly('Title found:', title);
    });
  });
});
