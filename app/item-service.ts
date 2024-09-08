import { firestoreDb } from "./firebase/config";
import {
  addDoc,
  doc,
  collection,
  deleteDoc,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  updateDoc,
} from "firebase/firestore";

export type ItemType = {
  id: string;
  name: string;
  cost: number;
};

export type Response<T> = {
  status: number;
  data: T;
};

class Cache {
  items = {} as { [id: string]: ItemType };

  set(items: ItemType[]) {
    console.log("setting to cache", items);
    if (items) {
      this.items = {};
      items.forEach((item) => {
        this.items[item.id] = item;
      });
    }
  }

  get(): ItemType[] {
    console.log("serving from cache", this.items);
    if (!this.items) {
      return [];
    }
    return Object.entries(this.items).map(([id, item]) => ({
      ...item,
      id,
    }));
  }

  delete(ids: string[]) {
    ids.forEach((id) => {
      if (this.items[id]) {
        delete this.items[id];
      }
    });
    console.log("deleted from cache", ids, this.items);
  }

  update(newItem: ItemType) {
    this.items[newItem.id] = newItem;
    console.log("updated cache", newItem, this.items);
  }
}
const cache = new Cache();

export async function saveItem(
  userId: string,
  itemData: ItemType,
): Promise<Response<null>> {
  const { id, ...item } = itemData;
  console.log("saving...", userId, id, item);

  return addDoc(collection(firestoreDb, userId), item)
    .then(() => {
      return {
        status: 200,
        data: null,
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        status: 500,
        data: null,
      };
    });
}

export async function getItems(
  userId: string,
): Promise<Response<ItemType[] | null> | null> {
  const querySnapshot = await getDocs(collection(firestoreDb, userId));
  const items = [] as ItemType[];
  querySnapshot.forEach(
    (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
      const data = doc.data();
      items.push({ name: data.name, cost: data.cost, id: doc.id });
    },
  );
  cache.set(items);
  return { status: 200, data: items };
}

export async function updateItems(
  userId: string,
  itemData: ItemType,
): Promise<Response<ItemType[]>> {
  const { id, ...item } = itemData;
  console.log("Update Items...", id, item);
  const docRef = doc(firestoreDb, userId, id);
  await updateDoc(docRef, item);
  cache.update(itemData);

  return Promise.resolve({ status: 200, data: cache.get() });
}

export async function deleteItems(
  userId: string,
  ids: string[],
): Promise<Response<ItemType[]>> {
  console.log("Deleting...", userId, ids);

  const responses = ids.map((id) => {
    deleteDoc(doc(firestoreDb, userId, id));
  });
  await Promise.all(responses);
  cache.delete(ids);
  const data = cache.get();

  return Promise.resolve({ status: 200, data });
}
