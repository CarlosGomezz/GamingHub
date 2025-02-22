"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

export interface Game {
    id: number;
    name: string;
    description?: string;
    platforms: {
        platform: {
            id: number;
            name: string;
            // slug: string;
            // gamesCount?: number;
        };
        released_at: Date;
    }[];
    background_image: string;
    released: string;
}

// interface Platform {
//     id: number;
//     platform: string;
//     relased_at: Date;
//     requirements_en: string;
// }

export function GameCard(props: Game) {
    const { id, name, platforms, background_image, released } = props;
    const platformOrder = [
        "PC",
        "PlayStation",
        "PSVita",
        "Xbox",
        "Mac",
        "iOS",
        "Linux",
        "Switch",
        "Android",
    ];

    return (
        <div className="flex flex-wrap justify-center gap-16 px-6 py-4">
            {/* {" "} */}
            {/* Más espacio entre tarjetas */}
            <Link
                href={`/games/${id}`}
                key={id}
                className="flex flex-col w-full md:w-1/3 lg:w-1/4 xl:w-1/5 bg-gray-900 text-white rounded-lg shadow-lg p-5 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
                {/* Imagen del juego */}
                <div className="w-full overflow-hidden rounded-lg">
                    <img
                        src={background_image}
                        alt={name}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                </div>

                {/* Nombre y fecha de lanzamiento */}
                <div className="text-center mt-4">
                    <h2 className="text-xl font-bold">{name}</h2>
                    <p className="text-gray-400 text-sm mt-1">{released}</p>
                </div>

                {/* Plataformas */}
                <div className="flex flex-wrap justify-center mt-4 gap-2">
                    {platforms
                        .sort(
                            (a, b) =>
                                platformOrder.indexOf(a.platform.name) -
                                platformOrder.indexOf(b.platform.name)
                        )
                        .map((platformEntry, id) => (
                            <span
                                key={id}
                                className="bg-gray-700 text-xs px-3 py-1 rounded-full"
                            >
                                {platformEntry.platform.name}
                            </span>
                        ))}
                </div>
            </Link>
        </div>
    );
}
