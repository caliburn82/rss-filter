const env = process.env;

export const rss = {
  url: env.RSS_URL || 'http://feeds.feedburner.com/crunchyroll/rss/anime',
  keyWords: env.RSS_KEY_WORDS || 'English Dub',
}

