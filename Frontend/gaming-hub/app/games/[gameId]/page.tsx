"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

interface GameDetails {
    id: number;
    name: string;
    description: string;
    background_image: string;
    released: string;
}

interface GameEditions {
    id: number;
    name: string;
    background_image: string;
}

interface Video {
    id: number;
    creator: number;
    game: number;
    title: string;
    description?: string;
    date: Date;
    video_path: string;
    likes: number;
    dislikes: number;
}

export default function GameDetails({
    params,
}: {
    params: { [key: string]: string };
}) {
    const laravelURL = process.env.NEXT_PUBLIC_LARAVEL_URL;
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const [fullDescription, setFullDescription] = useState<string>("");
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [gameEditions, setGameEditions] = useState<GameEditions[]>([]);
    const [uploadedVideos, setUploadedVideos] = useState<Video[]>([]);
    const [error, setError] = useState<string | null>(null);

    const toggleDescription = () => setShowFullDescription((prev) => !prev);

    function sanitizeDescription(description: string) {
        return DOMPurify.sanitize(description, { ALLOWED_TAGS: [] });
    }

    useEffect(() => {
        async function fetchGameDetails() {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${params.gameId}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
                );
                if (!response.ok)
                    throw new Error("Failed to fetch game details");
                const data = await response.json();
                setGameDetails(data);
                setFullDescription(sanitizeDescription(data.description));
                fetchUploadedVideos(data.id);
            } catch (error) {
                console.error(error);
                setError("Failed to load game details");
            }
        }

        async function fetchGameEditions() {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${params.gameId}/additions?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
                );
                if (!response.ok)
                    throw new Error("Failed to fetch game editions");
                const data = await response.json();
                setGameEditions(data.results || []);
            } catch (error) {
                console.error(error);
                setError("Failed to load game editions");
            }
        }

        async function fetchUploadedVideos(gameId: number) {
            try {
                const response = await fetch(
                    `${laravelURL}/api/listVideosGame`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ gameId }),
                    }
                );
                if (!response.ok)
                    throw new Error("Failed to fetch uploaded videos");

                const data = await response.json();
                setUploadedVideos(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load uploaded videos");
            }
        }

        fetchGameDetails();
        fetchGameEditions();
    }, [params.gameId]);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!gameDetails) return <p>Loading...</p>;

    return (
        <main className="text-white bg-gray-950 p-2">
            <section className="w-full h-1/3 space-y-4">
                <div className="relative w-full h-full bg-red-500 rounded-xl shadow-xl">
                    <img
                        src={gameDetails.background_image}
                        alt={gameDetails.name}
                        className="w-full h-full rounded-xl transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <h2 className="text-2xl font-bold text-gray-100">
                    {gameDetails.name}
                </h2>
                <p className="text-md font-medium text-gray-400 mt-4">
                    Released:{" "}
                    <span className="font-semibold text-gray-200">
                        {gameDetails.released}
                    </span>
                </p>

                {/* DESCRIPCIÓN */}
                <div className="">
                    <p className="text-lg text-gray-300 leading-relaxed mt-6">
                        {showFullDescription
                            ? fullDescription
                            : fullDescription.slice(0, 300) + "..."}
                    </p>
                    {/* BOTÓN PARA EXPANDIR Y O REDUCIR LA DESCRIPCIÓN */}
                    {fullDescription.length > 300 && (
                        <button
                            onClick={toggleDescription}
                            className="text-blue-400 hover:text-blue-300 transition font-semibold mt-2"
                        >
                            {showFullDescription ? "Read less" : "Read more"}
                        </button>
                    )}
                </div>
            </section>
            <div className="my-12 border-t border-gray-800 mx-auto w-3/4"></div>
            <section className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-10 text-center">
                    EDITIONS
                </h1>
                {gameEditions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {gameEditions.map((edition) => (
                            <div
                                key={edition.id}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                            >
                                <div className="relative h-56 w-full">
                                    {edition.background_image ? (
                                        <img
                                            src={edition.background_image}
                                            alt={edition.name}
                                            // layout="fill"
                                            // objectFit="cover"
                                            className="rounded-t-xl"
                                        />
                                    ) : (
                                        <div className="bg-gray-700 h-full flex items-center justify-center text-gray-400">
                                            <p>No image available</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <p className="text-xl font-semibold text-gray-100">
                                        {edition.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xl text-gray-400 text-center">
                        No editions available
                    </p>
                )}
            </section>
            <section>
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mt-10 mb-10 text-center">
                    UPLOADED VIDEOS
                </h1>
                {uploadedVideos.length > 0 ? (
                    uploadedVideos.map((video) => (
                        <div key={video.id}>
                            <h1 className="text-4xl font-bold mb-8">
                                {video.title}
                            </h1>
                            <div className="w-full max-w-3xl">
                                <video controls className="w-full rounded-xl">
                                    <source
                                        src={video.video_path}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                                {video.description && (
                                    <p className="text-gray-700 text-lg mt-4">
                                        {video.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 text-lg mt-4">
                        No hay videos
                    </p>
                )}
            </section>
        </main>
    );
}
