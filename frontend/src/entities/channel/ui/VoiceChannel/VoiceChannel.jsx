import { useVoiceMembersStore } from '@entities/channel/model/voiceMembersStore.js';
import { VoiceChannelIcon } from '@shared/assets/VoiceChannelIcon.jsx';
import { Avatar } from '@shared/ui/Avatar/index.js';

import style from './VoiceChannel.module.css';

export const EMPTY_ARRAY = []; // В Zustand нужно передавать стабильную ссылку, иначе все сломается

export const VoiceChannel = ({ channel, onClick }) => {
  const voiceChatMembers = useVoiceMembersStore(
    (state) => state.voiceMembers[channel.serverId]?.[channel.id] ?? EMPTY_ARRAY
  );

  return (
    <li className={style.channel} onClick={onClick}>
      <div>
        <VoiceChannelIcon />
        <p>{channel.name}</p>
        <p>
          {voiceChatMembers.length}/{channel.userLimit}
        </p>
      </div>
      <div>
        {voiceChatMembers.map((m) => (
          <div key={m.id}>
            <Avatar avatarUrl={m.avatarUrl} size={24}></Avatar>
            <p>{m.name}</p>
          </div>
        ))}
      </div>
    </li>
  );
};
