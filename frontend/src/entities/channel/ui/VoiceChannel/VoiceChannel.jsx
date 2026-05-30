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
      <div className={style.channelHeader}>
        <VoiceChannelIcon />
        <span className={style.channelName}>{channel.name}</span>
        <span className={style.memberCount}>
          {voiceChatMembers.length}/{channel.userLimit}
        </span>
      </div>
      {voiceChatMembers.length > 0 && (
        <div className={style.membersList}>
          {voiceChatMembers.map((member) => (
            <div key={member.id} className={style.member}>
              <Avatar avatarUrl={member.avatarUrl} size={24} />
              <span className={style.memberName}>{member.name}</span>
            </div>
          ))}
        </div>
      )}
    </li>
  );
};
