import { setUser, readConfig } from "./config";
import { getUser, createUser, resetUsers, getUsers } from "./lib/db/queries/users"
import { fetchFeed } from "./rssfeeds";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
     registry[cmdName] = handler
 }

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (!(cmdName in registry)) {
        throw new Error (`command "${cmdName}" does not exist`)
    }
    const command = registry[cmdName]
    await command(cmdName, ...args)
    return
}

export async function handlerLogin(cmdName:string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0]
    const existingUser = await getUser(userName)
        if (!existingUser) {
            throw new Error (`no registered user with name ${userName}`)
        }
    setUser(userName)
    console.log(`User has been set to ${userName}`)
}



export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }
    const userName = args[0]
    try {
        const existingUser = await getUser(userName)
        if (existingUser) {
            throw new Error (`user "${userName}" is already registered`)
        }
        await createUser(userName)
        setUser(userName)
        console.log(`User "${userName}" has been created`)
    } catch(err) {
        if (err instanceof Error) {
            throw new Error(`Error registering user ${userName}: ${err.message}`)
        }
        throw new Error(`Error registering user ${userName}: ${String(err)}`)
    }
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    if (args.length !== 0 ) {
        throw new Error("reset command does not take arguments")
    }
    await resetUsers()
    console.log("Users reset successfully")
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
    if (args.length !== 0 ) {
        throw new Error("users command does not take arguments")
    }

    const users = await getUsers();
    if (users.length ===  0) {
        throw new Error("no users in database")
    }

    const config = readConfig()
    const currentUser = config.currentUserName
    for (const dbUser of users) {
        if ( dbUser.name === currentUser) {
            console.log(`* ${dbUser.name} (current)`)
        } else {
            console.log(`* ${dbUser.name}`)
        }
    }
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} URL`)
    }
    const feedURL = args[0]
    await fetchFeed(feedURL);
}