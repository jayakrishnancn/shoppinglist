export type ShoppingListItemType = {
    id: string,
    name: string;
    price: number;

}

const db = {
    data: [] as ShoppingListItemType[]
}

async function getItem(id: string): Promise<ShoppingListItemType | null> {

    return Promise.resolve(db.data.find(i => i.id === id) ?? null);
}

async function getItems(): Promise<ShoppingListItemType[]> {

    return Promise.resolve(db.data);
}


async function addItem(item: ShoppingListItemType): Promise<ShoppingListItemType[]> {

    db.data.push(item);

    return Promise.resolve(db.data)
}

async function updateItem(item: ShoppingListItemType): Promise<ShoppingListItemType[]> {

    db.data = db.data.map(dbItem => {
        if (dbItem.id === item.id) {
            return item;
        }
        return dbItem;
    })

    return Promise.resolve(db.data)
}



async function deleteItem(id: string): Promise<ShoppingListItemType[]> {
    db.data = db.data.filter(i => i.id !== id);
    return Promise.resolve(db.data)
}



const shoppingListService = {
    getItems,
    getItem,
    addItem,
    updateItem,
    deleteItem

}
export default shoppingListService;