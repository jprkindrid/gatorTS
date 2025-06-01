import { CommandsRegistry, 
  handlerLogin, 
  runCommand, 
  registerCommand, 
  handlerRegister, 
  handlerReset } from "./handlers.js";

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.log("usage: cli <command> [arguments...]")
    process.exit(1)
  }

  const cmdName = args[0]
  const cmdArgs: string[] = args.slice(1)
  const registry: CommandsRegistry = {}
  await registerCommand(registry, "login", handlerLogin)
  await registerCommand(registry, "register", handlerRegister)
  await registerCommand(registry, "reset", handlerReset)

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