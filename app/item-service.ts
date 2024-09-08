export type ItemType = {
  id: string;
  name: string;
  cost: number;
};

export type Response<T> = {
  status: number;
  data: T;
};

const randomString = () => Math.random().toString(36).substring(2, 12);

export async function saveItem(
  userId: string,
  item: ItemType,
): Promise<Response<ItemType>> {
  console.log("saving...", userId, item);
  const items = (await getItems(userId))?.data || [];
  console.log(items);
  items.push({ ...item, id: randomString() });
  sessionStorage.setItem(userId, JSON.stringify(items));

  return Promise.resolve({ status: 200, data: item });
}

export async function getItems(
  userId: string,
): Promise<Response<ItemType[] | null> | null> {
  try {
    console.log("fetching...", userId);
    let data: ItemType[] | null = JSON.parse(
      sessionStorage.getItem(userId) || "null",
    );
    return Promise.resolve({ status: 200, data });
  } catch {}
  return null;
}

export async function deleteItems(
  userId: string,
  ids: string[],
): Promise<Response<ItemType[]>> {
  console.log("Deleting...", userId, ids);
  const items = ((await getItems(userId))?.data || []).filter(
    (i) => !ids.includes(i.id),
  );
  sessionStorage.setItem(userId, JSON.stringify(items));

  return Promise.resolve({ status: 200, data: items });
}
