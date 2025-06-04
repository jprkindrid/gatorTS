import { setUser, readConfig } from "./config";
import { getUser, createUser, resetUsers, getUsers } from "./lib/db/queries/users"
import { fetchFeed } from "./rss";

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

export async function handlerReset(cmdName: string, ...args: string[]) {
    if (args.length !== 0 ) {
        throw new Error("reset command does not take arguments")
    }
    await resetUsers()
    console.log("Users reset successfully")
}


