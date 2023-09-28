import toBoolean from './helpers/toBoolean';

const env = process.env;

export const RSS = {
  URL: env.RSS_URL || 'http://feeds.feedburner.com/crunchyroll/rss/anime',
  KEY_WORDS: (env.RSS_KEY_WORDS || 'English Dub').split('|'),
  DUPLICATES: toBoolean(env.RSS_DUPLICATES || 'false'),
}

export const LOGGER = {
  LEVEL: env.LOG_LEVEL || 'info',
  FORMAT: env.LOG_FORMAT || 'json',
};
