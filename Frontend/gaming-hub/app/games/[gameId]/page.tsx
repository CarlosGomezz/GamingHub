"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import AchievementCard from "../../components/achievementsCard/achievementsCard.component";

interface GameDetails {
    id: number;
    name: string;
    description: string;
    background_image: string;
    released: string;
    developers: {
        id: number;
        name: string;
        games_count: number;
        image_background: string;
        slug: string;
    }[];
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

interface Achievement {
    id: number;
    name: string;
    description: string;
    image?: string;
    percent: number;
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
    const [gameAchievements, setGameAchievements] = useState<Achievement[]>([]);
    const [uploadedVideos, setUploadedVideos] = useState<Video[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleDescription = () => setShowFullDescription((prev) => !prev);

    function sanitizeDescription(description: string) {
        return DOMPurify.sanitize(description, { ALLOWED_TAGS: [] });
    }

    const loadMoreAchievements = async () => {
        if (!nextPage) return;

        try {
            const response = await fetch(nextPage);
            if (!response.ok)
                throw new Error("Failed to fetch more achievements");

            const data = await response.json();
            setGameAchievements((prev) => [...prev, ...data.results]); // Agregar nuevos logros a los anteriores
            setNextPage(data.next); // Actualizar la URL para la próxima carga
        } catch (error) {
            console.error(error);
            setError("Failed to load more achievements");
        }
    };

    const handleExpand = (id: number) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    useEffect(() => {
        /**
         * FUNCIÓN PARA CONSEGUIR LOS DETALLES DE UN JUEGO
         */
        async function fetchGameDetails() {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${params.gameId}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
                );
                if (!response.ok)
                    throw new Error("Failed to fetch game details");
                const data = await response.json();
                console.log("DETALLES:", data);

                setGameDetails(data); // Guardamos los juegos
                setFullDescription(sanitizeDescription(data.description)); // Guardamos la descripción sin las etiquetas HTML
                fetchUploadedVideos(data.id); // Hacemos el fetch para ver los videos que hay subidos de este juego
                fetchGameAchievements(data.id); // Hacemos el fetch para saber los logros de este juego
                // https://api.rawg.io/api/games/{id}/achievements
            } catch (error) {
                console.error(error);
                setError("Failed to load game details");
            }
        }

        /**
         * FUNCIÓN PARA CONSEGUIR LAS EDICIONES DE UN JUEGO
         */
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

        /**
         * FUNIÓN PARA CONSEGUIR LOS LOGROS DE UN JUEGO
         * @param gameId
         * @returns
         */
        async function fetchGameAchievements(gameId: number) {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${gameId}/achievements?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page=1`
                );

                if (!response.ok)
                    throw new Error("Failed to fetch game achievements");
                const data = await response.json();
                console.log("ACHIEVEMENTS: ", data);

                // Si hay 10 o menos logros, cargamos solo esos
                if (data.count <= 10) {
                    setGameAchievements(data.results || []);
                    console.log("LOGROS: ", data.results);

                    return;
                }

                // Si hay entre 11 y 20 logros, hacemos una segunda petición
                if (data.count <= 20 && data.next) {
                    const response2 = await fetch(data.next);
                    if (!response2.ok)
                        throw new Error("Failed to fetch more achievements");
                    const data2 = await response2.json();

                    setGameAchievements([...data.results, ...data2.results]);
                    return;
                }

                // Si hay más de 20 logros, solo guardamos los primeros 10 y mostramos el botón "Cargar más"
                setGameAchievements(data.results || []);
                setNextPage(data.next); // Guardamos la URL de la siguiente página
            } catch (error) {
                console.error(error);
                setError("Failed to load game achievements");
            }
        }

        /**
         * FUNCIÓN PARA VER LOS VIDEOS QUE HAY SUBIDOS DE UN JUEGO
         * @param gameId
         */
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
    // if (!gameDetails) return <div className="animate-spin"></div>;
    if (!gameDetails) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    role="status"
                    className="flex items-center justify-center mt-20"
                >
                    <svg
                        aria-hidden="true"
                        className="inline-flex w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
            </div>
        );
    }
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
                <div>
                    <h1 className="text-3xl font-bold">DEVELOPERS</h1>
                    {gameDetails.developers.map((developer, index) => (
                        <div key={developer.id}>{developer.name}</div>
                    ))}
                </div>

                {/* DESCRIPCIÓN */}
                <div className="">
                    <h1 className="text-3xl font-bold">DESCRIPTION</h1>
                    <p className="text-lg text-gray-300 leading-relaxed">
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

            <section className="flex flex-col items-center py-12 px-6">
                {/* Título con efecto de degradado */}
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-10 text-center">
                    ACHIEVEMENTS
                </h1>

                {gameAchievements.length > 0 ? (
                    <div className="w-full flex flex-col items-center gap-10">
                        {gameAchievements.map((achievement) => (
                            <div key={achievement.id}>
                                <AchievementCard
                                    key={achievement.id}
                                    id={achievement.id}
                                    name={achievement.name}
                                    image={
                                        achievement.image ||
                                        "/placeholder-image.png"
                                    } // Imagen predeterminada si no hay imagen
                                    description={achievement.description}
                                    expanded={expandedId === achievement.id}
                                    onChange={handleExpand}
                                />
                            </div>
                        ))}

                        {/* Botón "Cargar más" si hay más logros */}
                        {nextPage && (
                            <button
                                onClick={() => loadMoreAchievements()}
                                className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-200 shadow-md"
                            >
                                Load More Achievements
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-lg mt-4">
                        There's no available achievements
                    </p>
                )}
            </section>
        </main>
    );
}
