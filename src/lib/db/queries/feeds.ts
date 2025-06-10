import { db } from ".."
import { feedFollows, feeds, users } from "../schema"
import { eq, and, sql } from "drizzle-orm";
import { getUser } from "./users";
import { readConfig } from "../../../config";
import { User, Feed } from "../schema";

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

export async function removeFollowForUser(user: User, feed: Feed) {

  await db.delete(feedFollows).where(and(
    eq(feedFollows.feedId, feed.id),
    eq(feedFollows.userId, user.id)
  ))
}

export async function markFeedFetched(feedID: string) {
  const now = new Date();
  await db.update(feeds)
  .set({ 
    updatedAt: now,
    lastFetchedAt: now,
  })
  .where(eq(feeds.id, feedID));
}

export async function getNextFeedToFetch() {
  const [feedsToCheck]= await db.select().from(feeds)
    .orderBy(sql `${feeds.lastFetchedAt} asc nulls first`)
    .limit(1) 
  return feedsToCheck
}