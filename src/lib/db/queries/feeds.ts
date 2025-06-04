import { db } from ".."
import { feedFollows, feeds, users } from "../schema"
import { eq } from "drizzle-orm";
import { getUser, getUserByID } from "./users";
import { readConfig } from "../../../config";

export async function createFeed(
  feedName: string,
  url: string,
  userId: string,
) {
  const [result] = await db
    .insert(feeds)
    .values({
      name: feedName,
      url,
      userId,
    })
    .returning();

  return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds)
    return result
}

export async function getFeedByUrl(url: string){
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url))
  return result
}

export async function createFeedFollow(url: string) {
  const config = readConfig();
  const user = await getUser(config.currentUserName)
  const feed = await getFeedByUrl(url)

  const [newFeedFollow] = await db.insert(feedFollows).values({
    userId: user.id , feedId: feed.id
  }).returning();


  const [result] = await db.select().from(feedFollows)
  .innerJoin(users, eq(feedFollows.userId, users.id))
  .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))

  return result
}

export async function getFeedFollowsForUser(userName: string) {
  const user = await getUser(userName)
  const result = db.select().from(feedFollows)
  .where(eq(feedFollows.userId, user.id))
  .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))

  return result
  
}