import { ResponseStatus } from "@/app/enums/request";
import shoppingListService from "./shoppingListService";




export async function GET(request: Request) {
    const data = await shoppingListService.getItems();
    return Response.json({ data, status: ResponseStatus.OK })
}

export async function POST(req: Request) {
    const newItem = await req.json();

    const data = await shoppingListService.addItem(newItem);
    return Response.json({ data, status: ResponseStatus.OK })
}