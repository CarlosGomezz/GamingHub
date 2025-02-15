"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

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

export default function GameDetails({
    params,
}: {
    params: { [key: string]: string };
}) {
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    // const [gameEditions, setGameEditions] = useState<GameEditions>();
    const [gameEditions, setGameEditions] = useState<GameEditions[]>([]);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /**
         * FUNCIÓN PARA CONSEGUIR LOS DETALLES PRINCIPALES DEL VIDEOJUEGO
         */
        async function getGameDetails() {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${params.gameId}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setGameDetails(data); // Guarda el objeto de detalles directamente
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load game details");
            }
        }

        /**
         * FUNCIÓN PARA CONSEGUIR TODAS LAS EDICIONES, DLCs, GOTY... DEL VIDEOJUEGO
         */
        async function getGameEditions() {
            try {
                const response = await fetch(
                    `https://api.rawg.io/api/games/${params.gameId}/additions?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                console.log("LAS EDICIONES DEL VIDEOJUEGO: ", data);

                setGameEditions(data.results || []); // Guarda el objeto de detalles directamente
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load game details");
            }
        }

        getGameDetails();
        getGameEditions();
    }, [params.gameId]); // Dependencia actualizada para ejecutar el efecto al cambiar el ID del juego

    // Mostrar mientras carga o si hay un error
    if (error) return <p className="text-red-500">{error}</p>;
    if (!gameDetails) return <p>Loading...</p>;

    // Mostrar los detalles del juego cuando estén disponibles
    return (
        <main className="text-white bg-gray-950 min-h-screen p-8">
            {/* Sección de detalles del juego */}
            <section className="max-w-6xl mx-auto">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-10 text-center">
                    GAME DETAILS
                </h1>

                <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-gray-100">
                        {gameDetails.name}
                    </h2>
                    <h3 className="text-lg font-semibold text-gray-400">
                        ID: {gameDetails.id}
                    </h3>

                    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-xl">
                        <Image
                            src={gameDetails.background_image}
                            alt={gameDetails.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl transition-transform duration-300 hover:scale-105"
                        />
                    </div>

                    <p className="text-lg text-gray-300 leading-relaxed mt-6">
                        {gameDetails.description}
                    </p>

                    <p className="text-lg font-medium text-gray-400 mt-4">
                        Released:{" "}
                        <span className="font-semibold text-gray-200">
                            {gameDetails.released}
                        </span>
                    </p>
                </div>
            </section>

            {/* Separador estilizado */}
            <div className="my-12 border-t border-gray-800 mx-auto w-3/4"></div>

            {/* Sección de ediciones */}
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
                                        <Image
                                            src={edition.background_image}
                                            alt={edition.name}
                                            layout="fill"
                                            objectFit="cover"
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
        </main>
    );
}
