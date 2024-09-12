import { ItemType } from "../item-service";

export class Cache {
  items = {} as { [id: string]: ItemType };

  clear() {
    this.items = {};
  }

  set(items: ItemType[]) {
    console.log("setting to cache", items);
    if (items) {
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

  updates(newItems: ItemType[]) {
    debugger;
    newItems.forEach((newItem) => {
      this.items[newItem.id] = newItem;
    });
    console.log("updated cache", this.items);
  }
}
