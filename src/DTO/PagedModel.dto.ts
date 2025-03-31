export class PagedModel<T> {
    content: T[];
    page: {
        totalElements: number;
        page: number;
        size: number;
        totalPages: number;
    };
}