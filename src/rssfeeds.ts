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
        //TODO: extract metadata, feed items, etc. basically steps 4 on in the lessons

        console.log(dataObj)
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error fetching feed: ${err.message}`)
        }
        throw new Error(`Error fetching feed: ${String(err)}`)
    }
}