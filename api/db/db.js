/* Here we have the initialization of the database, we get the data from
a json document... */

// Importing necessary modules from lowdb and path for file handling
import { Low, JSONFile } from 'lowdb';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// To obtain the __dirname path in an ES6 module
const __dirname = dirname(fileURLToPath(import.meta.url));
// Setting up the database file path
const file = join(__dirname, '../../data/users.json'); 

// Initializing the JSONFile adapter and the Low database instance
const adapter = new JSONFile(file); 
const db = new Low(adapter);

// Function to initialize the database
async function initDB() {
    // Read the data from the JSON file
    await db.read();
    // If the data is undefined, set a default structure
    db.data ||= { users: [] };
    // Write the default structure back to the JSON file if necessary
    await db.write();
}

// Exporting the db instance and the initDB function
export { db, initDB };