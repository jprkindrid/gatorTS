import { resolve } from "path";
import { fetchFeed } from "./rss";
import { scrapeFeeds } from "./scrape";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_requests>`)
    }
    let timeArg = args[0]
    const reqTimeBuffer = parseDuration(timeArg)
    if (!reqTimeBuffer) {
        throw new Error(
            `invalid duration: ${timeArg}, use h (hour), m(minute), s(second), and ms(milisecond)`
        )
    };

    console.log(`Collecting feeds every ${timeArg} `)

    scrapeFeeds().catch(handleError)

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError)
    }, reqTimeBuffer)

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval)
            resolve();
        });
    });

}

export function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex)
    if (match?.length !== 3) return;

    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case "ms":
            return value;
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        default:
            return;
    }
}

function handleError(err: unknown) {
    console.error(
        `Error scraping feeds: ${err instanceof Error ? err.message: err}`,
    )
}