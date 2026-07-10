// 인게임 스크린샷 저장소 — 의존성 없는 IndexedDB 미니 래퍼.
// dataURL(PNG)이 localStorage 용량(~5MB)을 쉽게 넘겨서 IndexedDB를 쓴다.

export type Screenshot = {
  id: number;
  dataUrl: string;
  createdAt: number;
};

const DB_NAME = "heoniverse";
const STORE = "screenshots";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>) {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const req = run(db.transaction(STORE, mode).objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

export function addScreenshot(dataUrl: string) {
  return tx("readwrite", (store) => store.add({ dataUrl, createdAt: Date.now() }));
}

export function getScreenshots(): Promise<Screenshot[]> {
  return tx<Screenshot[]>("readonly", (store) => store.getAll() as IDBRequest<Screenshot[]>);
}

export function removeScreenshot(id: number) {
  return tx("readwrite", (store) => store.delete(id));
}
