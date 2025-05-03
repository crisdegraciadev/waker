type Pageable = {
  pageNumber: number;
};

export class PageEntity<T> {
  data: T[];

  pageable: Pageable;

  constructor(partial: Partial<PageEntity<T>>) {
    Object.assign(this, partial);
  }
}
