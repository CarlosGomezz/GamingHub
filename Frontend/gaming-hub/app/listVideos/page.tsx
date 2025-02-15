// pages/uploadVideo.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Video {
    id: number;
    video_data: File;
    content_creator_id: number;
    title: string;
    description?: string;
    date: Date;
    video_path: string;
    likes: number;
    dislikes: number;
}

const PlayVideo: React.FC = () => {
    const laravelURL = process.env.NEXT_PUBLIC_LARAVEL_URL;
    const [videoCreatorId, setVideoCreatorId] = useState<number | null>(1);
    const [videoTitle, setVideoTitle] = useState<string>("");
    const [videoDescription, setVideoDescription] = useState<string>("");
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const [videoDate, setVideoDate] = useState<string>(formattedDate); // El estado debe ser de tipo string

    //   const [videosList, setVideosList] = useState<File | null>(null);
    const [videosList, setVideosList] = useState<Video[]>([]);

    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchVideos = async () => {
        setLoading(true);
        setError(null); // Reset any previous error

        try {
            const response = await fetch(`${laravelURL}/api/listVideos`, {
                method: "GET",
                // mode: "no-cors",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(laravelURL + "/api/listVideos");

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            setVideosList(data);

            console.log(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to list videos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-8">Play Video</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                {videosList.map((video: Video, id) => (
                    <Link
                        href={{
                            pathname: `/videos/${video.id}`,
                        }}
                        as={`/videos/${video.id}`}
                        key={video.id}
                        passHref
                    >
                        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                {video.title}
                            </h2>

                            <div className="w-full aspect-video overflow-hidden rounded-xl mb-4">
                                <video
                                    controls
                                    className="w-full h-full object-cover rounded-xl"
                                >
                                    <source
                                        src={video.video_path}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {video.description && (
                                <p className="text-gray-700 text-base leading-relaxed">
                                    {video.description}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PlayVideo;
