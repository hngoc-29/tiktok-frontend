"use client";
import React, { createContext, useState, ReactNode } from "react";
import { Video, User } from '@/type/types'

interface VideoContextType {
    videos: Video[];
    authors: { [key: number]: User };
    scrollIndex: number;
    videoPlaySettings: { [videoId: number]: { autoPlayOnView: boolean } }; // sửa đây
    setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
    setAuthors: React.Dispatch<React.SetStateAction<{ [key: number]: User }>>;
    setScrollIndex: React.Dispatch<React.SetStateAction<number>>;
    setVideoPlaySettings: React.Dispatch<
        React.SetStateAction<{ [videoId: number]: { autoPlayOnView: boolean } }>
    >;
}

export const VideoContext = createContext<VideoContextType>({
    videos: [],
    authors: {},
    scrollIndex: 0,
    videoPlaySettings: {},
    setVideos: () => { },
    setAuthors: () => { },
    setScrollIndex: () => { },
    setVideoPlaySettings: () => { }
});

export const VideoProvider = ({ children }: { children: ReactNode }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [authors, setAuthors] = useState<{ [key: number]: User }>({});
    const [scrollIndex, setScrollIndex] = useState(0);
    const [videoPlaySettings, setVideoPlaySettings] = useState<{ [videoId: number]: { autoPlayOnView: boolean } }>({});

    return (
        <VideoContext.Provider
            value={{
                videos,
                authors,
                scrollIndex,
                videoPlaySettings,
                setVideos,
                setAuthors,
                setScrollIndex,
                setVideoPlaySettings
            }}
        >
            {children}
        </VideoContext.Provider>
    );
};
