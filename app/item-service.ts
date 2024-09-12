import { firestoreDb } from "./firebase/config";
import {
  addDoc,
  doc,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
} from "firebase/firestore";
import { sortItems } from "./utils/sortItem";
import { Cache } from "./utils/Cache";

export type StatusType =
  | "Todo - Near future"
  | "Todo - Distant future"
  | "In Progress"
  | "Completed"
  | "Unknown";

export type ItemType = {
  id: string;
  name: string;
  cost: number;
  status: StatusType;
  createdAt?: number;
  updatedAt?: number;
};

const cache = new Cache();

export async function getItems(userId: string): Promise<ItemType[]> {
  console.log("Fetching...", userId);
  const querySnapshot = await getDocs(collection(firestoreDb, userId));
  let items = [] as ItemType[];
  querySnapshot.forEach(
    (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
      const data = doc.data();
      items.push({
        name: data.name,
        cost: data.cost,
        id: doc.id,
        status: data.status ?? "UNKNOWN",
        createdAt: data.createdAt || 0,
        updatedAt: data.updatedAt || 0,
      });
    }
  );
  items = sortItems(items, "updatedAt", "DESC");
  items = sortItems(items, "status");
  cache.clear();
  cache.set(items);
  return cache.get();
}

export async function saveItem(userId: string, items: ItemType): Promise<void> {
  console.log("creating...", userId, items);
  items.updatedAt = Date.now();
  items.createdAt = Date.now();
  const { id: _, ...item } = items;
  await addDoc(collection(firestoreDb, userId), item);
}

export async function updateItems(
  userId: string,
  items: ItemType[]
): Promise<ItemType[]> {
  console.log("Updating...", userId, items);
  const batch = writeBatch(firestoreDb);
  items.forEach((listItem) => {
    listItem.updatedAt = Date.now();
    listItem.createdAt = listItem.createdAt || Date.now();
    const { id, ...item } = listItem;
    const docRef = doc(firestoreDb, userId, id);
    batch.update(docRef, item);
  });
  await batch.commit();
  cache.updates(items);
  return cache.get();
}

export async function deleteItems(
  userId: string,
  ids: string[]
): Promise<ItemType[]> {
  console.log("Deleting...", userId, ids);
  const batch = writeBatch(firestoreDb);
  ids.forEach((id) => batch.delete(doc(firestoreDb, userId, id)));
  await batch.commit();
  cache.delete(ids);
  const data = cache.get();
  return data;
}
