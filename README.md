# gatorTS

A TypeScript-based CLI tool for managing and browsing RSS feeds and posts.
From the [boot.dev course](https://www.boot.dev/courses/build-blog-aggregator-typescript)

## Requirements
- Node.js (v18 or newer recommended)
- npm or yarn

## Installation
1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd gatorTS
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration
Before running the CLI, you need to set up a configuration file. Create a `config.ts` file in the `src/` directory or follow the instructions in the existing `config.ts` template. This file should include your database connection and any other required settings.

## Usage
You can run the CLI using:
```bash
npx ts-node src/index.ts <command> [options]
```
Or, if you have a build step, run the compiled JavaScript:
```bash
node dist/index.js <command> [options]
```

### Example Commands
- **Browse posts:**
  ```bash
  npx ts-node src/index.ts browse <post_limit>
  ```
  Lists the latest posts for the current user. Optionally specify the number of posts to display.

- **Aggregate feeds:**
  ```bash
  npx ts-node src/index.ts aggregate
  ```
  Aggregates and updates all feeds.

- **Add a feed:**
  ```bash
  npx ts-node src/index.ts feeds add <feed_url>
  ```
  Adds a new RSS feed to your list.

- **List users:**
  ```bash
  npx ts-node src/index.ts users list
  ```
  Lists all users in the database.

## Development
- TypeScript source is in the `src/` directory.
- Database migrations are in `src/lib/db/`.

## License
MIT
