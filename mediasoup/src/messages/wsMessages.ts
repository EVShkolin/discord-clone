import type {
  DtlsParameters,
  IceCandidate,
  IceParameters,
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from 'mediasoup/types';
import { VoiceChatMember } from './serverRequestTypes.js';
import {
  ChannelCreatedEvent,
  ChannelDeletedEvent,
  ChannelUpdatedEvent,
  MemberJoinedEvent,
  MemberLeftEvent,
  MessageCreatedEvent,
  MessageDeletedEvent,
  MessageUpdatedEvent,
} from './kafkaEvents.js';

export interface ProducerData {
  userId: number;
  producerId: string;
  kind: MediaKind;
}

export interface TransportParams {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

export interface ClientToServerEvents {
  // Signaling messages
  joinRoom: (
    data: { serverId: number; channelId: number },
    callback: (response: { rtpCapabilities?: RtpCapabilities; error?: string }) => void
  ) => void;

  createWebRtcTransport: (
    data: { consumer: boolean },
    callback: (response: { params: TransportParams }) => void
  ) => void;

  getProducers: (data: Record<string, never>, callback: (response: ProducerData[]) => void) => void;

  producerTransportConnect: (data: { dtlsParameters: DtlsParameters }, callback: () => void) => void;

  produce: (
    data: { kind: MediaKind; rtpParameters: RtpParameters },
    callback: (response: { id: string }) => void
  ) => void;

  recvTransportConnect: (data: { dtlsParameters: DtlsParameters }, callback: () => void) => void;

  consume: (
    data: { rtpCapabilities: RtpCapabilities; remoteProducerId: string },
    callback: (response: {
      id?: string;
      producerId?: string;
      kind?: MediaKind;
      rtpParameters?: RtpParameters;
      error?: string;
    }) => void
  ) => void;

  consumerResume: (data: { serverConsumerId: string }) => void;

  closeProducer: (data: { producerId: string }) => void;

  leaveRoom: (data: Record<string, never>, callback: () => void) => void;

  // General messages
  subscribeToServer: (
    data: { serverId: number },
    callback: (response: { members: Record<number, VoiceChatMember[]> }) => void
  ) => void;
}

export interface ServerToClientEvents {
  // Signaling messages
  connectionSuccess: (data: { socketId: string }) => void;

  newProducer: (data: { userId: number; producerId: string; kind: MediaKind }) => void;

  producerClosed: (data: { remoteProducerId: string }) => void;

  // General messages
  joinedVoiceChannel: (data: { serverId: number; channelId: number; user: VoiceChatMember }) => void;

  leftVoiceChannel: (data: { serverId: number; channelId: number; userId: number }) => void;

  messageCreated: (data: MessageCreatedEvent) => void;

  messageUpdated: (data: MessageUpdatedEvent) => void;

  messageDeleted: (data: MessageDeletedEvent) => void;

  channelCreated: (data: ChannelCreatedEvent) => void;

  channelUpdated: (data: ChannelUpdatedEvent) => void;

  channelDeleted: (data: ChannelDeletedEvent) => void;

  memberJoined: (data: MemberJoinedEvent) => void;

  memberLeft: (data: MemberLeftEvent) => void;
}
