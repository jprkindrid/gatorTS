import { fetchFeed } from "./rss";
import { readConfig } from "./config";
import { createFeed, createFeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds, removeFollowForUser } from "./lib/db/queries/feeds";
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

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <feed_name> <url>`);
    }
    const feedName = args[0];
    const feedUrl = args[1];
    
    try {
        const userID = user.id
        const dbFeed: Feed = await createFeed(feedName, feedUrl, userID)
        await createFeedFollow(feedUrl)
        printFeed(dbFeed, user)


    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error adding feed ${feedName}: ${err.message}`)
        }
        throw new Error(`Error adding feed ${feedName}: ${String(err)}`)
    }
}


export async function handlerFeeds(cmdName: string,user: User, ...args: string[]) {
    if (args.length !== 0 ) {
        throw new Error(`${cmdName} command does not take arguments`)
    }

    try {
        const feeds: Feed[] = await getFeeds();
        for (const feed of feeds) {
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

export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:          ${username}`);
  console.log(`* Feed:          ${feedname}`);
}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`)
    }

    const url = args[0]
    const feed = await getFeedByUrl(url)

    if (!feed) {
    throw new Error(`Feed not found: ${url}`);
    }
    
    try {
        const newFeedFollow = await createFeedFollow(url)
        console.log("Feed Followed:")
        printFeedFollow(user.name, feed.url)

    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error fetching feeds: ${err.message}`)
        }
        throw new Error(`Error fetching feeds: ${String(err)}`)
    }
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`)
    }

    const url = args[0]

    try {
        const feed = await getFeedByUrl(url)
        await removeFollowForUser(user, feed)

    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error fetching feeds: ${err.message}`)
        }
        throw new Error(`Error fetching feeds: ${String(err)}`)
    }   
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 0 ) {
        throw new Error(`${cmdName} command does not take arguments`)
    }

    try {
        const follows= await getFeedFollowsForUser(user.name);
        if (follows.length === 0) {
        console.log(`No feed follows found for this user.`);
        return;
    }
        console.log(`${user.name} is following:`)
        for (let follow of follows) {
            console.log(follow.feeds.name)
        }

    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error fetching feeds: ${err.message}`)
        }
        throw new Error(`Error fetching feeds: ${String(err)}`)
    }
}
