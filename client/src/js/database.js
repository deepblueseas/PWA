import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {

        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
    const db = await openDB('jate', 1);
    const tx = db.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');

    const request = store.add({content});
    const result = await request;
    console.log('Data has been saved to DB', result);

    await tx.done;
    console.log('Content added to db', content);
};


// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  try {

    const db = await openDB('jate', 1);
    const tx = db.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');

    const request = store.getAll();
    const result = await request

    // checks if result is empty
    if (result.length === 0 || !result[0].content) {
      console.warn('No valid content found in IndexedDB.');
      return; 
    }

    return result;
  } catch (error) {
    console.error('Error retrieving content from IndexedDB:', error);
    throw error; 
  }
};



initdb();
