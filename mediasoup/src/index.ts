import { Server } from './Server.js';

const port = process.env.MEDIASOUP_PORT || 4000;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = await Server.create(port as number);
