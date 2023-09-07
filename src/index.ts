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

const formatters: SIObject<Function> = {
  string: (key: string, value: string) => `<${key}>${value}</${key}>`,
  object: (key: string, value: SIObject<string>) => {
    const attributes = Object.entries({...value})
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<${key} ${attributes} />`;
  },
  array: (key: string, value: any[]) => `<${key}>${value.join(', ')}</${key}>`,
  default: (key: string, value: any) => `<!-- unknown: ${key} - ${typeof value}: ${JSON.stringify(value)} -->`,
};

function feedObjectToXml(feedObject: any): string {
  const items = feedObject.items
    .filter((item: any) => item.title.toLowerCase().includes(rss.keyWords.toLowerCase())) // filter by keywords
    .map((item: any) => {
      const itemHeaders = Object.entries(item)
        .map(([key, value]) => {
          let type: string = typeof value;
          if (type === 'object' && Array.isArray(value)) type = 'array';
          formatters.hasOwnProperty(type) || (type = 'default');

          return `\t\t\t\t${formatters[type](key, value)}`;
        });
      return `<item>\n${itemHeaders.join('\n')}\n\t\t</item>`;
    });

  const headers = Object.entries(feedObject)
    .filter(([key]) => key !== 'items')
    .map(([key, value]) => formatters.string(key, value));

  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:crunchyroll="http://www.crunchyroll.com/rss">\n' +
    '\t<channel>\n' +
    `\t\t${headers.join('\n')}\n` +
    `\t\t${items.join('\n')}\n` +
    '\t</channel>\n' +
    '</rss>';
}

export async function handler(): Promise<Response> {
  const {result, headers} = await getFeedContent();
  const body = feedObjectToXml(result);

  return {
    statusCode: 200,
    body, headers
  };
}
