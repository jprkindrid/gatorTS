import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { createPost } from "./lib/db/queries/posts";
import { fetchFeed } from "./rss";
import { Feed, NewPost } from "./lib/db/schema";

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(`No feeds to fetch.`);
    return;
  }
  console.log(`Found a feed to fetch!`);
  scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
    await markFeedFetched(feed.id)
    const feedData = await fetchFeed(feed.url)
    for (let feedItem of feedData.channel.item) {
        console.log(`Found post "${feedItem.title}"`)

        const now = new Date()

        await createPost({
            url: feedItem.link,
            feedId: feed.id,
            title: feedItem.title,
            createdAt: now,
            updatedAt: now,
            description: feedItem.description,
            publishedAt: new Date(feedItem.pubDate)
        }   satisfies NewPost)
    }

    console.log(
        `Feed ${feed.name} collected, ${feedData.channel.item.length} posts found`
    )
    
}