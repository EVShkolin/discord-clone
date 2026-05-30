import { create } from 'zustand';

export const useVoiceMembersStore = create((set) => ({
  voiceMembers: {}, // { serverId: { channelId: [member1, member2, ...] } }

  setVoiceChatMembers: (serverId, memberMap) => {
    if (!memberMap.members || Object.keys(memberMap.members).length === 0) return;
    set((state) => ({
      voiceMembers: {
        ...state.voiceMembers,
        [serverId]: { ...memberMap.members },
      },
    }));
  },

  addMember: (serverId, channelId, member) => {
    set((state) => {
      const server = state.voiceMembers[serverId] || {};
      return {
        voiceMembers: {
          ...state.voiceMembers,
          [serverId]: {
            ...server,
            [channelId]: [...(server[channelId] || []), member],
          },
        },
      };
    });
  },

  removeMember: (serverId, channelId, userId) => {
    set((state) => {
      const server = state.voiceMembers[serverId] || {};
      return {
        voiceMembers: {
          ...state.voiceMembers,
          [serverId]: {
            ...server,
            [channelId]: server[channelId].filter((m) => m.userId !== userId),
          },
        },
      };
    });
  },
}));
