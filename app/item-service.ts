import { firestoreDb } from "./firebase/config";
import {
  doc,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { sortItems } from "./utils/sortItem";
// import { Cache } from "./utils/Cache";

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

export type ProjectType = {
  id: string;
  name: string;
  sharedWith: string[];
};

const LIST = "LIST";

export async function getItems(
  userId: string,
  projectId: string
): Promise<ItemType[]> {
  console.log("Fetching...", userId);
  const querySnapshot = await getDocs(
    collection(firestoreDb, userId, projectId, LIST)
  );
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
  return items;
}

export async function saveItem(
  userId: string,
  projectId: string,
  items: ItemType[]
): Promise<void> {
  const batch = writeBatch(firestoreDb);
  for (const item of items) {
    console.log("creating...", userId, item);
    item.updatedAt = Date.now();
    item.createdAt = Date.now();
    const { id: _, ...itemWithoutId } = item;
    const col = collection(firestoreDb, userId, projectId, LIST);
    const ref = doc(col);
    batch.set(ref, itemWithoutId);
  }
  await batch.commit();
}

export async function updateItems(
  userId: string,
  projectId: string,
  items: ItemType[]
): Promise<ItemType[]> {
  console.log("Updating...", userId, items);
  const batch = writeBatch(firestoreDb);
  items.forEach((listItem) => {
    listItem.updatedAt = Date.now();
    listItem.createdAt = listItem.createdAt || Date.now();
    const { id, ...item } = listItem;
    const docRef = doc(firestoreDb, userId, projectId, LIST, id);
    batch.update(docRef, item);
  });
  await batch.commit();
  return getItems(userId, projectId);
}

export async function deleteItems(
  userId: string,
  projectId: string,
  ids: string[]
): Promise<ItemType[]> {
  console.log("Deleting...", userId, ids);
  const batch = writeBatch(firestoreDb);
  ids.forEach((id) =>
    batch.delete(doc(firestoreDb, userId, projectId, LIST, id))
  );
  await batch.commit();
  return getItems(userId, projectId);
}

export async function getProjects(userId: string) {
  const querySnapshot = await getDocs(collection(firestoreDb, userId));
  const items = [] as ProjectType[];
  querySnapshot.forEach(
    (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
      const data = doc.data();
      items.push({
        name: data.name,
        id: doc.id,
        sharedWith: [],
      });
    }
  );
  return items;
}

export async function addProject(
  userId: string,
  projectId: string
): Promise<void> {
  const item = {
    id: projectId,
    name: projectId,
    sharedWith: [],
  } as ProjectType;
  console.log("creating...", userId, item);
  await setDoc(doc(firestoreDb, userId, projectId), item);
}

export async function deleteProjects(
  userId: string,
  ids: string[]
): Promise<ProjectType[]> {
  console.log("Deleting...", userId, ids);

  const batch = writeBatch(firestoreDb);
  for (const id of ids) {
    const querySnapshot = await getDocs(
      collection(firestoreDb, userId, id, LIST)
    );

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    batch.delete(doc(firestoreDb, userId, id));
    batch.delete(doc(firestoreDb, userId, id));
  }
  await batch.commit();

  return getProjects(userId);
}

export async function updateProject(
  userId: string,
  items: ProjectType[]
): Promise<ProjectType[]> {
  console.log("Updating...", userId, items);
  const batch = writeBatch(firestoreDb);
  items.forEach((project) => {
    const docRef = doc(firestoreDb, userId, project.id);
    batch.update(docRef, project);
  });
  await batch.commit();
  return getProjects(userId);
}
