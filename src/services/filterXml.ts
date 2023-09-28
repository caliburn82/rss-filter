import { RSS } from '../config';
import { SIObject } from '../types/common';
import logger from './logger';

type KnownItems = SIObject<any[]>;
const knownItems: KnownItems = {};


function removeDuplicates(root: Document) {
  if (RSS.DUPLICATES) {
    logger.info('Duplicates are allowed');
    return
  }

  logger.info('Removing duplicates');
  // remove all but first and last duplicated items from root
  Object.entries(knownItems).forEach(([prefix, items]) => {
    if (items.length <= 2) {
      return;
    }

    logger.info('Removing %d items with prefix "%s"', items.length - 2, prefix);
    items.slice(1, items.length - 1)
      .forEach((item) => root.documentElement.removeChild(item));
  });
}

function filterNode(item: any, root: Document) {
  const title = item.getElementsByTagName('title')[0].textContent;
  logger.debug('Checking item: "%s"', title)

  // remove items that don't match our keywords
  const isMatch = RSS.KEY_WORDS.some((keyWord) => title.includes(keyWord));
  if (!isMatch) {
    logger.debug('Removed - does not match keywords:', RSS.KEY_WORDS.join(', '));
    root.documentElement.removeChild(item);
    return;
  }

  logger.info('Added item: "%s"', title);
  const prefix: string = title.split(' (')[0];
  knownItems[prefix] = knownItems[prefix] || [];
  knownItems[prefix].push(item);
}

export default function filterXml(xmlData: string): string {
  logger.info('Filtering XML');
  const xmldom = require('xmldom');
  const xpath = require('xpath');

  const parser = new xmldom.DOMParser();
  const serializer = new xmldom.XMLSerializer();

  const root = parser.parseFromString(xmlData, 'text/xml');
  const items = xpath.select('//item', root)

  logger.info('Found %d items', items.length);
  items.forEach((item: any) => filterNode(item, root));
  logger.info('Found %d groups after filtering', Object.keys(knownItems).length);

  removeDuplicates(root);

  return serializer.serializeToString(root);
}
