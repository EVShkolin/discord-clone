import {useEffect, useRef} from 'react';
import styles from './VideoFrame.module.css';
import {Avatar} from "@shared/ui/Avatar/index.js";
import {useVoiceSessionStore} from "@app/provider/voiceSessionStore.js";
import {useAuth} from "@app/provider/AuthProvider.jsx";

export const LocalVideoFrame = () => {
    const videoRef = useRef(null);
    const { user } = useAuth();
    const { videoStream } = useVoiceSessionStore();
    const videoTrack = videoStream?.getTracks()[0];

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;
        videoElement.srcObject = null;
        videoElement.defaultMuted = true;
        videoElement.muted = true;

        if (videoTrack) {
            videoElement.srcObject = new MediaStream([videoTrack]);
        }

        return () => {
            if (videoElement) {
                videoElement.srcObject = null;
            }
        };
    }, [videoTrack]);

    return (
        <div className={styles.videoFrame}>
            {videoTrack ? (
                <video className={styles.video} ref={videoRef} autoPlay playsInline muted />
            ) : (
                <div className={styles.placeholder}>
                    <Avatar avatarUrl={user.avatarUrl} size={40} />
                    <span>{user.name}</span>
                </div>
            )}
        </div>
    );
};
