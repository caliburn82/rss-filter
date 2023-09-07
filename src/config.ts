const env = process.env;

export const rss = {
  url: env.RSS_URL || 'https://crunchyroll.com/rss/anime',
  keyWords: env.RSS_KEY_WORDS || 'English Dub',
}

