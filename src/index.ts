import { CommandsRegistry, 
  handlerLogin, 
  runCommand, 
  registerCommand, 
  handlerReset } from "./handlers.js";

import { handlerUsers, handlerRegister } from "./users.js";
import { handlerAddFeed, handlerAgg, handlerFeeds } from "./feeds.js";

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.log("usage: cli <command> [arguments...]")
    process.exit(1)
  }

  const cmdName = args[0]
  const cmdArgs: string[] = args.slice(1)
  const registry: CommandsRegistry = {}
  registerCommand(registry, "login", handlerLogin)
  registerCommand(registry, "register", handlerRegister)
  registerCommand(registry, "reset", handlerReset)
  registerCommand(registry, "users", handlerUsers)
  registerCommand(registry, "agg", handlerAgg)
  registerCommand(registry, "addfeed", handlerAddFeed)
  registerCommand(registry, "feeds", handlerFeeds)

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
    process.exit(0); // Exit successfully after command completes
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
}

main();