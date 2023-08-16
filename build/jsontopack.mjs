// Dump one or more json file to LevelDB databases
import { ClassicLevel } from 'classic-level';
import { existsSync, promises as fs } from 'fs';
import path from 'path';

main();

async function main() {
    // We need at least two arguments: inputs and output directories
    if (process.argv.length < 5) {
        throw new Error('Usage: jsontopack.js type <output dir> <input dir ...>');
    }
    for (let i = 4; i < process.argv.length; i++) {
        await packCompendium(process.argv[2], process.argv[i], process.argv[3]);
    }
}

/**
 * Create a LevelDB from the json defining a compendium pack
 * @param {string} type   The type of document to be packed
 * @param {string} output The directory to write to
 * @param {string} input  The directory to read files from
 */
async function packCompendium(type, input, output) {
    // Get the full path to the output DB
    output = path.resolve(output, path.basename(input));

    // If the output DB exists then clear it
    if (existsSync(output)) { await fs.rm(output, { recursive: true }); }

    // Create the DB and start a transaction
    const db = new ClassicLevel(output, { valueEncoding: 'json'});
    const batch = db.batch();

    // Create DB records for each folder or file in the input
    await packFolders(batch, input);
    await packFiles(batch, type, input);

    // Commit and close the DB
    await batch.write();
    await db.close();

    // Confirm success
    await console.log('Built ' + output);
}

/**
 * Add any folders found in files to the batch
 * @param {object} batch The LevelDB batch we're writing
 * @param {string} dir   The directory we're processing
 */
async function packFolders(batch, dir) {
    // Get the entries in the directory
    const entries = await fs.readdir(path.resolve(dir));

    // Now process each subdirectory in the entries
    for (const e of entries) {
        // We'll need the full path to the entry
        let entry = path.resolve(dir, e);
        let stat = await fs.lstat(entry);

        // We process directories that don't begin with '.'
        if (!e.startsWith('.') && stat.isDirectory()) {
            // Read the folder details and convert them to JSON
            const file = path.resolve(entry, '_folder.json');
            const json = JSON.parse(await fs.readFile(file, 'utf-8'));

            // Build the key and create the DB record
            const key = '!folders!' + json._id;
            batch.put(key, json);

            // Recurse to find any subdirectories
            await packFolders(batch, entry);
        }
    }
}

/**
 * Add any JSON files found in files to the batch
 * @param {object} batch The LevelDB batch we're writing
 * @param {string} type  The type of document to be packed
 * @param {string} dir   The directory we're processing
 */
async function packFiles(batch, type, dir) {
    // Get the entries in the directory
    const entries = await fs.readdir(path.resolve(dir));

    // Now process each file in the entries
    for (const e of entries) {
        // We'll need the full path to the entry
        let entry = path.resolve(dir, e);
        let stat = await fs.lstat(entry);

        // We don't process directories but should recurse into them
        if (!e.startsWith('.') && stat.isDirectory()) {
            await packFiles(batch, type, entry);
        } else if (!e.startsWith('.') && !e.startsWith('_') && e.endsWith('.json')) {
            // Read the file and convert it to JSON
            const json = JSON.parse(await fs.readFile(entry, 'utf-8'));

            // Build the key for this DB record
            const key = '!' + type + '!' + json._id;

            // Handle actor items, which v11 splits into separate records
            let actorItems = [];
            if (type === 'actors' && json.items.length > 0) {
                // Update the actor record to link to the items
                actorItems = json.items;
                json.items = json.items.map((i) => i._id);
            }

            // Handle journal pages, which v11 splits into separate records
            let journalPages = [];
            if (type === 'journal' && json.pages.length > 0) {
                // Update the journal record to link to the pages
                journalPages = json.pages;
                json.pages = json.pages.map((p) => p._id);
            }

            // Put the (possibly-updated) record
            batch.put(key, json);

            // Now add a record for each item for actors
            for (let i of actorItems) {
                const key = i.key || '!' + 'actors.items' + '!' + json._id + '.' + i._id;
                batch.put(key, i);
            }

            // Or add a record for each page for journals
            for (let p of journalPages) {
                const key = p.key || '!' + 'journal.pages' + '!' + json._id + '.' + p._id;
                batch.put(key, p);
            }
        }
    }
}
