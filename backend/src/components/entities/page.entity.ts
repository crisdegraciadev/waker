type Pageable = {
  pageNumber: number;
  pageSize: number;
  totalEntities: number;
  totalPages: number;
  nextPage: number;
  prevPage: number;
};

export class PageEntity<T> {
  data: T[];

  pageable: Pageable;

  constructor(partial: Partial<PageEntity<T>>) {
    Object.assign(this, partial);
  }
}
