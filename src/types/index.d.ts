export type Store = {
  name: string;
  logo: string;
  address: string;
  description: string;
  url: string;
  id: string;
  genre: string;
  interest_count: number;
};

type ResponseStatus = {
  status: {
    code: number;
    message: string;
  };
};

type Paginate = {
  paginate: {
    total_count: number;
    total_page: number;
    current_page: number;
  };
};

export interface IndexStoreResponse extends ResponseStatus, Paginate {
  stores: Store[];
  total: number;
}
