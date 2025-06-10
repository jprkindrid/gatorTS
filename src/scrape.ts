import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { fetchFeed } from "./rss";

export async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch()
    await markFeedFetched(nextFeed.id)
    const feed = await fetchFeed(nextFeed.url)
    for (let feedItem of feed.channel.item) {
        console.log(feedItem)
    }
    
}