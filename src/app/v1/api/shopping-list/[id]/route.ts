import { ResponseStatus } from "@/app/enums/request";
import shoppingListService from "../shoppingListService";

export async function GET(
    request: Request,
    { params: { id } }: { params: { id: string } }
) {
    const data = shoppingListService.getItem(id);
    return Response.json({ data, status: ResponseStatus.OK })
}



export async function PUT(request: Request) {
    const data = shoppingListService.getItems();
    return Response.json({ data, status: ResponseStatus.OK })
}

export async function DELETE(request: Request, { params: { id } }: { params: { id: string } }) {
    const data = await shoppingListService.deleteItem(id)
    return Response.json({ data, status: ResponseStatus.OK });
}