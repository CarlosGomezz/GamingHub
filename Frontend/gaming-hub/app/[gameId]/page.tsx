"use client";
import Image from "next/image";
import { useEffect, useState } from 'react';

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

export default function GameDetails({ params }: { params: { [key: string]: string } }) {
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
                const response = await fetch(`https://api.rawg.io/api/games/${params.gameId}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setGameDetails(data); // Guarda el objeto de detalles directamente
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load game details');
            }
        }

        /**
         * FUNCIÓN PARA CONSEGUIR TODAS LAS EDICIONES, DLCs, GOTY... DEL VIDEOJUEGO
         */
        async function getGameEditions() {
            try {
                const response = await fetch(`https://api.rawg.io/api/games/${params.gameId}/additions?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }


                const data = await response.json();
                console.log("LAS EDICIONES DEL VIDEOJUEGO: ", data);

                setGameEditions(data.results || []); // Guarda el objeto de detalles directamente
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load game details');
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
        <main className="text-white">
            <h1 className="text-5xl">DETAILS:</h1>

            <br></br>

            <h3 className="text-3xl font-bold">{gameDetails.name}</h3>
            <Image
                src={gameDetails.background_image}
                alt={gameDetails.name}
                width={800}
                height={450}
                className="rounded"
            />
            <p className="mt-4">{gameDetails.description}</p>
            <p className="text-lg mt-2">Released: {gameDetails.released}</p>

            <br></br>

            <hr></hr>

            <br></br>

            <h1 className="text-3xl">EDITIONS</h1>

            {gameEditions.length > 0 ? (
                gameEditions.map((edition) => (
                    <div key={edition.id} className="flex flex-col w-2/5 md:w-1/4 lg:w-1/5 items-center justify-center bg-gray-800 m-2 p-4 rounded transition-transform transform hover:scale-105 hover:cursor-pointer">
                        <p>{edition.name}</p>
                        {edition.background_image ? (
                            <Image
                                src={edition.background_image}
                                alt={edition.name}
                                width={800}
                                height={450}
                                className="rounded"
                            />
                        ) : (
                            // Imagen de respaldo si no hay background_image
                            <div className="bg-gray-700 text-white flex items-center justify-center w-full h-64">
                                <p>No image available</p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No editions available</p>
            )}


        </main>
    );
}
