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
        packCompendium(process.argv[2], process.argv[3], process.argv[i]);
    }
}

/**
 * Create a LevelDB from the json defining a compendium pack
 * @param {string} type   The type of document to be packed
 * @param {string} output The directory to write to
 * @param {string} input  The directory to read files from
 */
async function packCompendium(type, output, input) {
    // Get the full path to the output DB
    output += '/' + path.basename(input);

    // If the output DB exists then clear it
    if (existsSync(output)) { await fs.rm(output, { recursive: true }); }

    // Create the DB and start a transaction
    console.log('Creating ' + output);
    const db = new ClassicLevel(output, { valueEncoding: 'json'});
    const batch = db.batch();

    // Get the files that should be DB records
    const files = await fs.readdir(path.resolve(input));

    // Read each file in a subdirectory and write it to the DB
    for (const f of files) {
        // Read the file and convert it to JSON
        const file = path.resolve(input, f);
        const json = JSON.parse(await fs.readFile(file, 'utf-8'));

        // Build the key for this DB record
        const key = json._key || '!' + type + '!' + json._id;

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

    // Commit and close the DB
    await batch.write();
    await db.close();

    // Confirm success
    console.log('Built ' + output);
}
