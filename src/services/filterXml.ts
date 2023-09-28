import { RSS } from '../config';
import logger from './logger';

export default function filterXml(xmlData: string): string {
  logger.info('Filtering XML');
  const xmldom = require('xmldom');
  const xpath = require('xpath');

  const parser = new xmldom.DOMParser();
  const serializer = new xmldom.XMLSerializer();

  const root = parser.parseFromString(xmlData, 'text/xml');
  const items = xpath.select('//item', root)

  const knownItems: string[] = [];
  logger.info('Found %d items', items.length);

  items.forEach((item: any) => {
    const title = item.getElementsByTagName('title')[0].textContent;
    logger.debug('Checking item: "%s"', title)

    // if we already know about this item, remove it
    const prefix = title.split(' - Episode ')[0];
    if (!RSS.DUPLICATES && knownItems.includes(prefix)) {
      logger.debug('Removed duplicate item');
      root.documentElement.removeChild(item);
      return;
    }

    // remove items that don't match our keywords
    const isMatch = RSS.KEY_WORDS.some((keyWord) => title.includes(keyWord));
    if (!isMatch) {
      logger.debug('Removed - does not match keywords:', RSS.KEY_WORDS.join(', '));
      root.documentElement.removeChild(item);
      return;
    }

    logger.info('Added item: "%s"', title);
    knownItems.push(prefix);
  });

  logger.info('Found %d items after filtering', knownItems.length);

  return serializer.serializeToString(root);
}
