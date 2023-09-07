import { Response, SIObject } from "./types/common";
import { rss } from "./config";

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
  return {body, headers};
}

function filterXml(xmlData: string): string {
  const xmldom = require('xmldom');
  const xpath = require('xpath');

  const parser = new xmldom.DOMParser();
  const serializer = new xmldom.XMLSerializer();

  const root = parser.parseFromString(xmlData, 'text/xml');
  const items = xpath.select('//item', root)

  items.forEach((item: any) => {
    const title = item.getElementsByTagName('title')[0].textContent;
    const description = item.getElementsByTagName('description')[0].textContent;

    const isMatch = rss.keyWords.some((keyWord) => {
      return title.includes(keyWord) || description.includes(keyWord);
    });

    if (!isMatch) {
      root.documentElement.removeChild(item);
    }
  });

  return serializer.serializeToString(root);
}

export async function handler(): Promise<Response> {
  const {body, headers} = await getFeedContent();
  const filteredXml = filterXml(body);

  return {
    statusCode: 200,
    body: filteredXml, headers
  };
}
