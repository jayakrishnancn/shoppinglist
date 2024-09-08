import { firestoreDb } from "./firebase/config";
import {
  addDoc,
  doc,
  collection,
  deleteDoc,
  getDocs,
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
  item: ItemType,
): Promise<Response<null>> {
  console.log("saving...", userId, item);

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
  const items = [] as any[];
  querySnapshot.forEach((doc: any) =>
    items.push({ ...doc.data(), id: doc.id }),
  );
  return { status: 200, data: items };
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
