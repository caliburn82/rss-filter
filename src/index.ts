import filterXml from './services/filterXml';
import getFeedContent from './services/getFeedContent';
import logger from './services/logger';
import { Response } from "./types/common";

export async function handler(): Promise<Response> {
  logger.info('Processing start');

  const { body, headers } = await getFeedContent();
  const filteredXml = filterXml(body);

  return {
    statusCode: 200,
    body: filteredXml, headers
  };
}
