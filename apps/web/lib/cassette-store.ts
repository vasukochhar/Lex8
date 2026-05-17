// A simple IndexedDB wrapper for the Cassette Mode

const DB_NAME = 'Anchor8CassetteDB';
const STORE_NAME = 'cassettes';
const DB_VERSION = 1;

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'hash' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToCassette(hash: string, payload: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ hash, payload, timestamp: Date.now() });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function readFromCassette(hash: string): Promise<any | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(hash);
    request.onsuccess = () => resolve(request.result ? request.result.payload : null);
    request.onerror = () => reject(request.error);
  });
}

export async function generateHash(requestPayload: any): Promise<string> {
  const str = JSON.stringify(requestPayload);
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
