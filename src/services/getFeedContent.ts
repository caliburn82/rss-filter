import { RSS } from '../config';
import { SIObject } from '../types/common';
import logger from './logger';

const blacklist = [
  'content-encoding',
];

export default async function getFeedContent() {
  logger.info('Fetching RSS feed');
  const response = await fetch(RSS.URL);

  const headers: SIObject<string> = {};
  response.headers.forEach((value, key) => {
    blacklist.includes(key.toLowerCase()) || (headers[key] = value)
  });

  const body = await response.text();
  return { body, headers };
}
