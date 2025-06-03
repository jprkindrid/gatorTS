import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    try {
        const resp = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator"
        }
        })
        const data = await resp.text();
        const parser = new XMLParser();
        let dataObj = parser.parse(data);
        if (!dataObj.rss || !dataObj.rss.channel) {
            throw new Error("data missing channel")
        }
        const channel = dataObj.rss?.channel;
        if (!channel) {
          throw new Error("failed to parse channel");
        }

        if (!channel.title || !channel.link || !channel.description) {
          throw new Error("channel missing field")
        }

        const feed: RSSFeed = {
          channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: [],
          }
        }
        if (!(channel.item)) {
          return feed
        }

        if (!Array.isArray(channel.item)) {
          feed.channel.item = [channel.item];
          return feed
        }

        for (let item of channel.item) {
          if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
          }
          const result: RSSItem = {
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
          }
          feed.channel.item.push(result)     
        }
        return feed

    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error fetching feed: ${err.message}`)
        }
        throw new Error(`Error fetching feed: ${String(err)}`)
    }
}