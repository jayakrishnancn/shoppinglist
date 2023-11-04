import { ResponseStatus } from "../enums/request"

export type ResponseType<T> = {
    status: ResponseStatus
    data: T
}
