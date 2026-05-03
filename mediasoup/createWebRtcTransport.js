const webRtcTransportOptions = {
  listenIps: [
    {
      ip: '0.0.0.0',
      announcedIp: '127.0.0.1', // TODO
    },
  ],
  enableUdp: true,
  enableTcp: true,
  preferUdp: true,
};

export const createWebRtcTransport = async (router) => {
  try {
    const transport = await router.createWebRtcTransport(webRtcTransportOptions);

    transport.on('dtlsstatechange', dtlsState => {
      if (dtlsState === 'close') transport.close();
    });

    transport.on('close', () => {
      console.log(`Transport ${transport.id} closed`);
    });

    return transport;
  } catch (err) {
    console.log(err);
  }
};