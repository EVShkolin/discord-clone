export type Message = {
  id: string;
  type: string;
  content: string;
  channelId: number;
  author: {
    id: number;
    name: string;
    avatarUrl: string | null;
    status: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type MessageCreatedEvent = {
  message: Message;
  serverId: number;
  type: string;
};

export type MessageUpdatedEvent = MessageCreatedEvent;

export type MessageDeletedEvent = {
  serverId: number;
  channelId: number;
  messageId: string;
  type: string;
};


export type Channel = {
  id: number;
  serverId: number;
  name: string;
  type: 'TEXT' | 'VOICE';
  userLimit: number;
};

export type ChannelCreatedEvent = {
  channel: Channel;
  serverId: number;
  type: string;
};

export type ChannelUpdatedEvent = ChannelCreatedEvent;

export type ChannelDeletedEvent = {
  serverId: number;
  channelId: number;
  type: string;
};


export type ServerMember = {
  id: number;
  userId: number;
  name: string;
  avatarUrl: string | null;
  serverId: number;
  memberSince: string;
};

export type MemberJoinedEvent = {
  member: ServerMember;
  serverId: number;
  type: string;
};

export type MemberLeftEvent = {
  member: ServerMember;
  serverId: number;
  type: string;
};