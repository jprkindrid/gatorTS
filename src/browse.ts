import { getpostsForUser } from "./lib/db/queries/posts";
import { User } from "./lib/db/schema";

export async function handleBrowse(
    cmdName: string, 
    user: User,
    ...args: string[]
) {
    let limit = 2;
    if (args.length === 1){
        let limitArgs = parseInt(args[0])
        if (limitArgs) {
            limit = limitArgs
        } else {
            throw new Error (`Usage: ${cmdName} <post_limit>`)
        }
    }

    const posts = await getpostsForUser(user.id, limit)

    console.log(`Found ${posts.length} posts for user ${user.name}`);
    for (let post of posts) {
        console.log(`${post.publishedAt} from ${post.feedName}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`---------------------------------`);
    }
}