"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import AchievementCard from "../../components/achievementsCard/achievementsCard.component";
import ErrorPopup from "@/app/components/errorPopup/errorPopup.component";
import SuccessPopup from "@/app/components/successPopup/successPopup.component";
// import { GameDetails, GameEditions, Achievement, Video } from "./gameInterfaces";

import type {
    GameDetails,
    GameEditions,
    Achievement,
    Video,
} from "./gameInterfaces";

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
            console.log("Fetching videos for game ID:", gameId);

            console.log("URL:", `${laravelURL}/api/listVideosGame`);

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

    // if (error) return <p className="text-red-500">{error}</p>;
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
        <main className="text-white bg-gray-950 min-h-screen p-4 sm:p-8">
            {/* Notificaciones */}
            <ErrorPopup error={error} onClose={() => setError(null)} />
            {/* Portada del juego */}
            <section className="w-full space-y-6">
                <Link
                    href={`/uploadVideo/${gameDetails.id}`}
                    className="mt-10 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Upload Video
                </Link>
                <div className="relative w-full h-72 sm:h-96 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={gameDetails.background_image}
                        alt={gameDetails.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>

                {/* Nombre y fecha */}
                <div className="text-center space-y-2">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-100">
                        {gameDetails.name}
                    </h2>
                    <p className="text-lg italic font-medium text-gray-400">
                        Released:{" "}
                        <span className="text-gray-200">
                            {gameDetails.released.split("-")[0]}
                        </span>
                    </p>
                </div>

                {/* Developers */}
                <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold mb-4">DEVELOPERS</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {gameDetails.developers.map((developer) => (
                            <span
                                key={developer.id}
                                className="bg-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-gray-700 transition"
                            >
                                {developer.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Descripción */}
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-3xl font-bold mb-4 mt-8">
                        DESCRIPTION
                    </h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        {showFullDescription
                            ? fullDescription
                            : fullDescription.slice(0, 300) + "..."}
                    </p>
                    {fullDescription.length > 300 && (
                        <button
                            onClick={toggleDescription}
                            className="text-blue-400 hover:text-blue-300 font-semibold mt-4 transition"
                        >
                            {showFullDescription ? "Read less" : "Read more"}
                        </button>
                    )}
                </div>
            </section>

            {/* Separador */}
            <div className="my-12 border-t border-gray-800 mx-auto w-3/4"></div>

            {/* Editions */}
            <section className="max-w-6xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-12">
                    EDITIONS
                </h1>
                {gameEditions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {gameEditions.map((edition) => (
                            <div
                                key={edition.id}
                                className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 cursor-pointer"
                            >
                                {edition.background_image ? (
                                    <img
                                        src={edition.background_image}
                                        alt={edition.name}
                                        className="h-56 w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-56 flex items-center justify-center bg-gray-700 text-gray-400">
                                        No image available
                                    </div>
                                )}
                                <div className="p-5">
                                    <p className="text-lg font-semibold text-gray-100">
                                        {edition.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xl text-gray-400">
                        No editions available
                    </p>
                )}
            </section>

            {/* Uploaded Videos */}
            <section className="max-w-4xl mx-auto py-16">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-12 text-center">
                    UPLOADED VIDEOS
                </h1>
                {uploadedVideos.length > 0 ? (
                    uploadedVideos.map((video) => (
                        <div key={video.id} className="mb-16">
                            <h2 className="text-3xl font-bold mb-6">
                                {video.title}
                            </h2>
                            <div className="w-full overflow-hidden rounded-2xl shadow-lg">
                                <video controls className="w-full rounded-2xl">
                                    <source
                                        src={video.video_path}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            {video.description && (
                                <p className="text-gray-300 text-lg mt-6">
                                    {video.description}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No hay videos</p>
                )}
            </section>

            {/* Achievements */}
            <section className="flex flex-col items-center py-20">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-12">
                    ACHIEVEMENTS
                </h1>
                {gameAchievements.length > 0 ? (
                    <div className="w-full flex flex-col items-center gap-12">
                        {gameAchievements.map((achievement) => (
                            <AchievementCard
                                key={achievement.id}
                                id={achievement.id}
                                name={achievement.name}
                                image={
                                    achievement.image ||
                                    "/placeholder-image.png"
                                }
                                description={achievement.description}
                                expanded={expandedId === achievement.id}
                                onChange={handleExpand}
                            />
                        ))}
                        {nextPage && (
                            <button
                                onClick={loadMoreAchievements}
                                className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-105"
                            >
                                Load More Achievements
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 text-lg text-center">
                        There's no available achievements
                    </p>
                )}
            </section>
        </main>
    );
}
