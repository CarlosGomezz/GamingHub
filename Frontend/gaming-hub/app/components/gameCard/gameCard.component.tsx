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
    rating: number;
}

// interface Platform {
//     id: number;
//     platform: string;
//     relased_at: Date;
//     requirements_en: string;
// }

export function GameCard(props: Game) {
    const { id, name, platforms, background_image, released, rating } = props;
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
        <div className="flex flex-wrap justify-center gap-12 px-8 py-6">
            <Link
                href={`/games/${id}`}
                key={id}
                className="flex flex-col w-full md:w-1/3 lg:w-1/4 xl:w-1/5 bg-gray-900 text-white rounded-2xl shadow-md hover:shadow-2xl transition-transform transform hover:scale-105 p-4 overflow-hidden"
            >
                {/* Imagen del juego */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    <img
                        src={background_image}
                        alt={name}
                        className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                    />
                </div>

                {/* Nombre y Rating */}
                <div className="text-center mt-4 space-y-1">
                    <h2 className="text-lg font-bold truncate">{name}</h2>
                    <p className="text-yellow-400 text-sm flex items-center justify-center gap-1">
                        ⭐ {rating.toFixed(1)}
                    </p>
                </div>

                {/* Plataformas */}
                <div className="flex flex-wrap justify-center mt-4 gap-2">
                    {platforms
                        .sort(
                            (a, b) =>
                                platformOrder.indexOf(a.platform.name) -
                                platformOrder.indexOf(b.platform.name)
                        )
                        .map((platformEntry, idx) => (
                            <span
                                key={idx}
                                className="bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1 rounded-full"
                            >
                                {platformEntry.platform.name}
                            </span>
                        ))}
                </div>

                {/* Fecha de lanzamiento */}
                <div className="flex justify-end mt-4">
                    <p className="text-gray-400 text-xs italic">
                        Released: {released.split("-")[0]}
                    </p>
                </div>
            </Link>
        </div>
    );
}
