import { db } from ".."
import { feeds } from "../schema"

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

