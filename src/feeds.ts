import { fetchFeed } from "./rss";
import { readConfig } from "./config";
import { createFeed, getFeeds } from "./lib/db/queries/feeds";
import { getUser, getUserByID } from "./lib/db/queries/users";
import { User, Feed } from "./lib/db/schema";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    // if (args.length !== 1) {
    //     throw new Error(`usage: ${cmdName} URL`)
    // }
    let feedURL = args[0]
    feedURL = "https://www.wagslane.dev/index.xml"
    const result = await fetchFeed(feedURL);
    console.log(result)
    for (let item of result.channel.item) {
        console.log(item)
    }
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }
    const config = readConfig();
    const userName = config.currentUserName;
    const feedName = args[0];
    const feedUrl = args[1];
    
    try {
        const dbUser: User = await getUser(userName)
        const userID = dbUser.id
        const dbFeed: Feed = await createFeed(feedName, feedUrl, userID)
        printFeed(dbFeed, dbUser)


    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error adding feed ${feedName}: ${err.message}`)
        }
        throw new Error(`Error adding feed ${feedName}: ${String(err)}`)
    }
}


export async function handlerFeeds(cmdname: string, ...args: string[]) {
    if (args.length !== 0 ) {
        throw new Error("feeds command does not take arguments")
    }

    try {
        const feeds: Feed[] = await getFeeds();
        for (const feed of feeds) {
            const user: User = await getUserByID(feed.userId);
            printFeed(feed, user)
        }
        
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error fetching feeds: ${err.message}`)
        }
        throw new Error(`Error fetching feeds: ${String(err)}`)
    }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
  console.log(`------------------------------`)
}

