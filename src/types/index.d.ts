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

type LineAccount = {
  id: number;
  name: string;
  picture_url: string;
};

export interface IndexLineAccountResponse extends ResponseStatus {
  line_accounts: LineAccount[];
}

type UserGroup = {
  id: number;
  group_name: string;
  line_bot_id: string;
};

export interface IndexUserGroup extends ResponseStatus {
  user_groups: (UserGroup & {
    users: User[];
  })[];
}

export interface CreateUserGroup extends ResponseStatus {
  user_group: UserGroup;
}

type LineBot = {
  id: number;
  user_id: number;
  line_bot_id: string;
  name: string;
  line_channel_secret: string;
  line_channel_token: string;
  picture_url: string;
  basic_id: string;
};

export interface IndexLineBot extends ResponseStatus {
  line_bots: LineBot[];
}

export type User = {
  id: number;
  email: string;
  name: string;
  lineUserId: string;
};

export interface SearchUser extends ResponseStatus {
  user: User;
}

export interface AddUser extends ResponseStatus {
  user: User;
}
