import express, { Express } from 'express';
import { VoiceChatMember } from './messages/serverRequestTypes.js';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Channel } from 'node:diagnostics_channel';

const TOKEN = process.env.MEDIASOUP_JWT;

export class ApiServer {
  #expressApp: Express;
  #apiClient: AxiosInstance;

  static create() {
    const expressApp = express();
    const apiClient = ApiServer.createApiClient();
    return new ApiServer(expressApp, apiClient);
  }

  private constructor(expressApp: Express, apiClient: AxiosInstance) {
    this.#expressApp = expressApp;
    this.#apiClient = apiClient;

    this.handleExpressApp();
  }

  private static createApiClient() {
    const host = process.env.BACKEND_HOST;
    const port = process.env.BACKEND_PORT;
    const baseUrl = `${host}:${port}`;
    console.log(baseUrl);
    const client = axios.create({
      baseURL: `${baseUrl}/api`,
      timeout: 5000,
    });

    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      config.headers.Authorization = `Bearer ${TOKEN}`;
      return config;
    });

    return client;
  }

  async fetchChannelData(serverId: number, channelId: number): Promise<Channel> {
    const response = await this.#apiClient.get<Channel>(`/v1/servers/${serverId}/channels/${channelId}`);
    return response.data;
  }

  async fetchUserData(serverId: number, userId: number): Promise<VoiceChatMember> {
    const response = await this.#apiClient.get<VoiceChatMember>(
      `/v1/servers/${serverId}/members/by-user?userId=${userId}`
    );
    return response.data;
  }

  async fetchVoiceChatMembers(serverId: number, userIds: number[]): Promise<VoiceChatMember[]> {
    const response = await this.#apiClient.post<VoiceChatMember[]>(`/v1/servers/${serverId}/members/search`, userIds);
    return response.data;
  }

  private handleExpressApp() {
    console.log(this.#expressApp.path());
  }
}
