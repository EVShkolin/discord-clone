import { Room } from './Room.js';
import { Peer } from './Peer.js';
import { RouterRtpCodecCapability, RtpCapabilities, Worker } from 'mediasoup/types';
import { EnhancedEventEmitter } from 'mediasoup/extras';
import { ChannelInfo } from './messages/responseData.js';

const mediaCodecs: RouterRtpCodecCapability[] = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
      'x-google-start-bitrate': 1000,
    },
  },
];

export type RoomManagerEvents = {
  'get-channel-info': [
    { serverId: number; channelId: number },
    resolve: (channelInfo: ChannelInfo) => void,
    reject: (error: Error) => void,
  ];

  'joined-voice-channel': [{ userId: number; serverId: number; channelId: number }];

  'left-voice-channel': [{ userId: number; serverId: number; channelId: number }];
};

export type VoiceChatMember = {
  userId: number;
  memberId?: number;
  name?: string;
  avatarUrl?: string;
  currentChannelId: number;
};

export class RoomManager extends EnhancedEventEmitter<RoomManagerEvents> {
  #worker: Worker;
  #rooms: Map<number, Room> = new Map();

  constructor(worker: Worker) {
    super();
    this.#worker = worker;
  }

  getVoiceChatMembersByServerId(serverId: number): Map<number, VoiceChatMember> {
    const members = new Map<number, VoiceChatMember>();
    for (const [channelId, room] of this.#rooms) {
      if (room.serverId === serverId) {
        for (const userId of room.peers.keys()) {
          const member: VoiceChatMember = { userId, currentChannelId: channelId };
          members.set(userId, member);
        }
      }
    }

    return members;
  }

  async connectPeerToRoom(
    data: { peer: Peer; serverId: number; channelId: number },
    callback: (response: { rtpCapabilities?: RtpCapabilities; error?: string }) => void
  ): Promise<void> {
    console.log(`Connecting peer ${data.peer.userId} to room ${data.channelId}`);
    let room = this.#rooms.get(data.channelId);
    console.log('Room exists: ', !!room);
    if (!room) {
      room = await this.createNewRoom(data.serverId, data.channelId);
      console.log('Created new room: ', room.toJSON());
    }

    if (room.getMemberCount() >= room.userLimit) {
      callback({ error: 'Room is full' });
      return;
    }

    room.connectPeer(data.peer);
    callback({ rtpCapabilities: room.getRtpCapabilities() });
  }

  private async createNewRoom(serverId: number, channelId: number): Promise<Room> {
    const channelInfo = await new Promise<ChannelInfo>((resolve, reject) => {
      this.emit('get-channel-info', { serverId, channelId }, resolve, reject);
    });

    if (channelInfo.type === 'TEXT') {
      // TODO exception
    }

    const router = await this.#worker.createRouter({ mediaCodecs });
    const room = new Room(channelInfo.serverId, channelId, channelInfo.userLimit, router);
    this.#rooms.set(channelId, room);
    this.handleRoom(room);
    return room;
  }

  private handleRoom(room: Room): void {
    room.on('closed', () => {
      this.#rooms.delete(room.channelId);
    });

    room.on('joined-voice-channel', ({ userId }): void => {
      this.emit('joined-voice-channel', { userId, serverId: room.serverId, channelId: room.channelId });
    });

    room.on('left-voice-channel', ({ userId }): void => {
      this.emit('left-voice-channel', { userId, serverId: room.serverId, channelId: room.channelId });
    });
  }
}
