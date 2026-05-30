export type VoiceChatMember = {
  userId: number;
  memberId?: number;
  name?: string;
  avatarUrl?: string;
  currentChannelId: number;
};
