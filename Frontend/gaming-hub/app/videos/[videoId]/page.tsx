"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Video {
    id: number;
    content_creator_id: number;
    title: string;
    description?: string;
    date: Date;
    video_path: string;
    likes: number;
    dislikes: number;
}

const VideoPage = ({ params }: { params: { videoId: string } }) => {
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const laravelURL = process.env.NEXT_PUBLIC_LARAVEL_URL;
    console.log(params.videoId);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`${laravelURL}/api/returnVideo`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ videoId: params.videoId }),
                });

                console.log("RESPONSE", response);

                if (!response.ok) {
                    throw new Error("Error fetching video");
                }
                const data = await response.json();

                console.log("DATA", response);
                setVideo(data);
            } catch (err) {
                setError("Failed to load video");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [params.videoId]);

    if (loading) return <p>Loading video...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!video) return <p>Video not found</p>;

    return (
        <div className="flex flex-col items-center min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-8">{video.title}</h1>

            <div className="w-full max-w-3xl">
                <video controls className="w-full rounded-xl">
                    <source src={video.video_path} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {video.description && (
                    <p className="text-gray-700 text-lg mt-4">
                        {video.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default VideoPage;
