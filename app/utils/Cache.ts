import { ItemType } from "../item-service";

const ITEM_KEY = "item-key";
export class Cache {
  items = {} as { [id: string]: ItemType };

  clear() {
    this.items = {};
    localStorage.setItem(ITEM_KEY, JSON.stringify(this.items));
  }

  set(items: ItemType[]): void {
    console.log("setting to cache", items);
    if (items) {
      items.forEach((item) => {
        this.items[item.id] = item;
      });
    }
    localStorage.setItem(ITEM_KEY, JSON.stringify(this.items));
  }

  get(): ItemType[] {
    console.log("serving from cache", this.items);
    if (!this.items) {
      return [];
    }

    let items = this.items;
    try {
      items = JSON.parse(localStorage.getItem(ITEM_KEY) || "{}") || {};
    } catch (e) {
      localStorage.setItem(ITEM_KEY, JSON.stringify(items));
      console.log(e);
    }

    return Object.entries(items).map(([id, item]) => ({
      ...item,
      id,
    }));
  }

  delete(ids: string[]): void {
    ids.forEach((id) => {
      if (this.items[id]) {
        delete this.items[id];
      }
    });
    console.log("deleted from cache", ids, this.items);
    localStorage.setItem(ITEM_KEY, JSON.stringify(this.items));
  }

  updates(newItems: ItemType[]): void {
    debugger;
    newItems.forEach((newItem) => {
      this.items[newItem.id] = newItem;
    });
    console.log("updated cache", this.items);
    localStorage.setItem(ITEM_KEY, JSON.stringify(this.items));
  }
}
