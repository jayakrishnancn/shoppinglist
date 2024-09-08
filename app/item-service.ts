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
  return { status: 200, data: items };
}

export async function updateItems(
  userId: string,
  itemData: ItemType,
): Promise<Response<null>> {
  const { id, ...item } = itemData;
  console.log("Update Items...", id, item);
  const docRef = doc(firestoreDb, userId, id);
  await updateDoc(docRef, item);

  return Promise.resolve({ status: 200, data: null });
}

export async function deleteItems(
  userId: string,
  ids: string[],
): Promise<Response<null>> {
  console.log("Deleting...", userId, ids);

  const responses = ids.map((id) => {
    deleteDoc(doc(firestoreDb, userId, id));
  });
  await Promise.all(responses);

  return Promise.resolve({ status: 200, data: null });
}
