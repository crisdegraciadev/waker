type Pageable = {
  pageNumber: number;
};

export class Page<T> {
  data: T[];

  pageable: Pageable;

  constructor(partial: Partial<Page<T>>) {
    Object.assign(this, partial);
  }
}
