import { Response, SIObject } from "./types/common";
import { rss } from "./config";
import Parser from 'rss-parser';

const parser = new Parser();

const blacklist = [
  'content-encoding',
];

async function getFeedContent() {
  const response = await fetch(rss.url);

  const headers: SIObject<string> = {};
  response.headers.forEach((value, key) => {
    blacklist.includes(key.toLowerCase()) || (headers[key] = value)
  });

  const body = await response.text();
  const result = await parser.parseString(body);
  return {result, headers};
}

function feedObjectToXml(feedObject: any): string {
  const items = feedObject.items
    .filter((item: any) => item.title.toLowerCase().includes(rss.keyWords.toLowerCase())) // filter by keywords
    .map((item: any) => {
      const itemHeaders = Object.entries(item)
        // .filter(([key, value]) => typeof value === 'string')
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `    <${key}>${value}</${key}>`;
          }

          // value to html attributes
          if (typeof value === 'object') {
            const attributes = Object.entries({...value})
              .map(([key, value]) => `${key}="${value}"`)
              .join(' ');

            return `    <${key} ${attributes} />`;
          }

          return `<!-- unknown: ${key} - ${typeof value}: ${JSON.stringify(value)} -->`;
        });
      return `  <item>${itemHeaders.join('\n')}</item>`;
    });

  const headers = Object.entries(feedObject)
    .filter(([key]) => key !== 'items')
    .map(([key, value]) => {
      return `  <${key}>${value}</${key}>`;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:crunchyroll="http://www.crunchyroll.com/rss">
      <channel>
        ${headers.join('\n')}
        ${items.join('\n')}
      </channel>
    </rss>`;
}

export async function handler(): Promise<Response> {
  const {result, headers} = await getFeedContent();
  const body = feedObjectToXml(result);

  return {
    statusCode: 200,
    body, headers
  };
}
