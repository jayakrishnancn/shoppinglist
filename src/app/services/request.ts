import { ResponseStatus } from "../enums/request";
import { ResponseType } from "../types/request";

export function post<T, U>(url: string, body: T, additioinal?: any): Promise<ResponseType<U>> {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        ...(additioinal ?? {})

    }).then(res => res.json())
        .then(res => {
            if (res && res.status === ResponseStatus.OK) {
                return res;
            }
            throw new Error("An error occurred!.");
        })
}



export function deleteItem<T, U>(url: string, additioinal?: any): Promise<ResponseType<U>> {
    return fetch(url, {
        method: "DELETE",
        ...(additioinal ?? {})

    }).then(res => res.json())
        .then(res => {
            if (res && res.status === ResponseStatus.OK) {
                return res;
            }
            throw new Error("An error occurred!.");
        })
}