export class ListResponse<T> {
    next: string;
    previous: string;
    results: T[];
    count: number;
}
