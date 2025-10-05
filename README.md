# MongoDB Data Layer — Week 1

This repository contains example scripts and instructions for the Week 1 assignment: "MongoDB data layer fundamentals and advanced techniques." The README below explains how to run every script included in the repository using PowerShell on Windows, with notes about configuring the MongoDB connection URI.

## Quick overview

- `insert_books.js` — Inserts sample book documents into a `books` collection.
- `queries.js` — Runs example queries against the database (find, filter, projection).
- `examples/mongodb_connection_example.js` — Minimal example showing how to connect and run simple operations using the Node.js MongoDB driver.
- `examples/mongodb_shell_example.js` — Snippets intended for the mongo shell (JS file for reference).
- `SETUP_INSTRUCTIONS.md` — Steps to install and run MongoDB locally (read this first if you don't have MongoDB).
- `Week1-Assignment.md` — The assignment brief and tasks to complete.

## Prerequisites

- Node.js (v14 or newer recommended) and npm. Verify with:

```powershell
node -v
npm -v
```

- A running MongoDB instance (local or remote). If you need help, follow `SETUP_INSTRUCTIONS.md`.

## Connection configuration

All example scripts use a MongoDB connection URI. You can either edit the files and update the URI directly, or set an environment variable `MONGODB_URI` before running the scripts. The examples expect a URI with the standard format:

mongodb://<host>:<port> or mongodb+srv://<user>:<password>@<cluster-url>/

Example for a local server (default):

```powershell
$env:MONGODB_URI = "mongodb://localhost:27017"
```

If the scripts use a database name variable, they will commonly create/use a `booksdb` or similar. Check the top of each script for a default DB name.

## How to run the scripts (PowerShell)

Open PowerShell and cd into the repository root. If you want to run files from the `examples` folder, `cd` to that folder first where indicated.

1) Insert sample books

```powershell
# optional: set the connection URI if not default
$env:MONGODB_URI = "mongodb://localhost:27017"

# run the insert script from repository root
node insert_books.js
```

2) Run example queries

```powershell
# ensure MONGODB_URI is set if non-default
$env:MONGODB_URI = "mongodb://localhost:27017"

node queries.js
```

3) Run the Node connection example

```powershell
cd examples
# install dependencies first (one-time)
npm install

# set URI if needed, then run
$env:MONGODB_URI = "mongodb://localhost:27017"
node mongodb_connection_example.js
```

4) Use the mongo shell example (reference file)

The file `examples/mongodb_shell_example.js` contains JavaScript snippets you can run in the `mongosh` (or `mongo`) shell. To open the shell and run the file:

```powershell
# start mongosh connected to localhost
mongosh "mongodb://localhost:27017"

# inside the shell, you can load the file (if supported) or copy-paste snippets
load('c:/path/to/repo/examples/mongodb_shell_example.js')
```

Note: `mongosh` may not support load depending on version; copy-paste is always supported.

## Troubleshooting

- Connection refused: Ensure MongoDB is running. On Windows you may need to start the MongoDB service or run `mongod` manually.
- Auth errors: Verify username/password and that the user has access to the target database.
- Script errors: Open the script, check the connection URI and the database name constants. Add console.log statements to inspect variables.

## Tips

- Use environment variables rather than hardcoding credentials. For PowerShell:

```powershell
$env:MONGODB_URI = "mongodb+srv://username:password@cluster.example.com/mydb?retryWrites=true&w=majority"
node insert_books.js
```

- If you want automatic scripting or repeated runs, consider adding npm scripts in `examples/package.json` (I can add these if you'd like).

## Files to check or edit

- `insert_books.js` — check for a `const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'` line. If absent, add it or update the script's connection string.
- `queries.js` — similar check for connection URI and DB/collection names.

---
