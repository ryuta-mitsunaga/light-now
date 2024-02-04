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

type SendGroup = {
  id: number;
  group_name: string;
  line_bot_id: id;
  line_bot_friends?: LineBotFriend[];
};

export interface IndexSendGroup extends ResponseStatus {
  send_groups: SendGroup[];
}

export interface CreateSendGroup extends ResponseStatus {
  send_group: SendGroup;
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

export type LineBotFriend = {
  id: number;
  line_user_id: string;
  picture_url: string;
  name: string;
};

export interface IndexLineBotFriend extends ResponseStatus {
  line_bot_friends: LineBotFriend[];
}
