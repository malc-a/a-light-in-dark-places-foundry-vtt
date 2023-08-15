// Dump every record from a LevelDB DB into a JSON document
import { ClassicLevel } from 'classic-level';
import { existsSync, promises as fs } from 'fs';
import path from 'path';

main();

async function main() {
    // We need two arguments - the output and input directories
    if (process.argv.length < 4) {
        throw new Error('Usage: packtojson.mjs <output dir> <input dir ...>');
    }
    for (let i = 3; i < process.argv.length; i++) {
        unpackCompendium(process.argv[2], process.argv[i]);
    }
}

/**
 * Create a JSON file from the records in a LevelDB DB
 * @param {string} output The directory write records to
 * @param {string} input  The DB to read records from
 */
async function unpackCompendium(output, input) {
    // Open the DB we're unpacking
    const db = new ClassicLevel(input, { valueEncoding: 'json'});
    var records = [];
    var actorItems = {};
    var journalPages = {};

    // Read each record in the DB and add it to the array
    for await (const [key, value] of db.iterator()) {
        // Add actors, items and journals to the records
        if (key.startsWith('!actors!') || key.startsWith('!items!')
            || key.startsWith('!journal!') || key.startsWith('!adventures!')) {
            records.push(cleanUp(value));
        } else {
            // Store actor item or journal page records to be processed later
            let m = key.match(/^\!actors\.items\!(\w+)\.(\w+)$/);
            if (m) {
                actorItems[m[1]] = actorItems[m[1]] || [];
                actorItems[m[1]].push(value);
            } else {
                m = key.match(/^\!journal\.pages\!(\w+)\.(\w+)$/);
                if (m) {
                    journalPages[m[1]] = journalPages[m[1]] || [];
                    journalPages[m[1]].push(value);
                }
            }
        }
    }

    // Close the DB
    await db.close();

    // Add each actor item record to the correct actor
    for (const [actor, items] of Object.entries(actorItems)) {
        // Find the correct actor to update
        let r = records.find((a) => a._id === actor);

        // Now replace each item ID in the actor with the full item
        for (const ai of items) {
            let i = r.items.findIndex((i) => i === ai._id);
            r.items[i] = ai;
        }
    }

    // Add each journal page record to the correct journal
    for (const [journal, pages] of Object.entries(journalPages)) {
        // Find the correct journal to update
        let r = records.find((j) => j._id === journal);

        // Now replace each item ID in the actor with the full item
        for (const jp of pages) {
            let i = r.pages.findIndex((p) => p === jp._id);
            r.pages[i] = jp;
        }
    }

    // Now write each record to the output file
    for (let r of records) {
        // We use the name of the item as the filename
        const file = output + '/' + r.name.toLowerCase() + '.json';
        fs.writeFile(file, JSON.stringify(r, null, 2) + '\n');

        // Confirm success
        console.log('Wrote ' + file);
    }
}

/**
 * Clean up the JSON record read from a pack. This mostly means that we
 * want to set all flags entries to empty objects, and remove all _stats
 * objects, regardless of the
 * @param {object} record The record we're cleaning up
 */
function cleanUp(record) {
    // If record is null then there's nothing to do
    if (record === null) { return record; }

    // Remove any _stats property in the record
    if ('_stats' in record) { delete record._stats };

    // Then set any flags property to empty
    if ('flags' in record) { record.flags = {} };

    // Now traverse any objects within the record
    for (let key in record) {
	if (typeof record[key] === 'object') { record[key] = cleanUp(record[key]) };
    }

    // Return the updated record
    return record;
}
