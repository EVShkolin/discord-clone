import { Router, DtlsState, WebRtcTransport, WebRtcTransportOptions } from 'mediasoup/types';

const MEDIASOUP_IP = process.env.MEDIASOUP_IP || '127.0.0.1';

const webRtcTransportOptions: WebRtcTransportOptions = {
  listenInfos: [
    {
      protocol: "udp",
      ip: '0.0.0.0',
      announcedAddress: MEDIASOUP_IP,
      portRange: { min: 2000, max: 2020 }
    },
    {
      protocol: "tcp",
      ip: '0.0.0.0',
      announcedAddress: MEDIASOUP_IP,
      portRange: { min: 2000, max: 2020 }
    }
  ],
  enableUdp: true,
  enableTcp: true,
  preferUdp: true,
};

export const createWebRtcTransport = async (router: Router): Promise<WebRtcTransport> => {
  try {
    const transport: WebRtcTransport = await router.createWebRtcTransport(webRtcTransportOptions);

    transport.on('dtlsstatechange', (dtlsState: DtlsState) => {
      if (dtlsState === 'closed') transport.close();
    });

    transport.on('@close', () => {
      console.log(`Transport ${transport.id} closed`);
    });

    return transport;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
