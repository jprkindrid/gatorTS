import { setUser, readConfig } from "./config";
import { getUser, createUser, resetUsers, getUsers } from "./lib/db/queries/users"

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