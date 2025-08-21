"use client";

import { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

export default function VideoPlayer({ src }: { src: string }) {
    const [muted, setMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    return (
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
            <video
                ref={videoRef}
                src={src}
                autoPlay
                loop
                muted={muted}
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Nút mute */}
            <IconButton
                onClick={toggleMute}
                sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    bgcolor: "rgba(0,0,0,0.4)",
                    color: "white",
                    width: 36,
                    height: 36,
                }}
            >
                {muted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
        </Box>
    );
}
