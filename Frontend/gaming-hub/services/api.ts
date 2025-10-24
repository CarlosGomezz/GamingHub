"use client";

import { rawgioEndpoints } from "./endpoints";

export const RAWGIO_CONFIG = {
    BASE_URL: "https://rawg.io/api",
    API_KEY: process.env.NEXT_PUBLIC_RAWG_API_KEY,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_RAWG_API_KEY}`,
    },
};

export const fetchGameAchievements = async (gameId: number) => {
    const endpoint = rawgioEndpoints.gameAchievements(gameId.toString());
    // ? `${RAWGIO_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
    //       gameId
    //   )}`
    // : `${RAWGIO_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    console.log("jeejeje SUUUU");
    const response = await fetch(endpoint, {
        method: "GET",
        headers: RAWGIO_CONFIG.headers,
    });

    if (!response.ok) {
        // @ts-ignore
        throw new Error(`Failed to fetch movies:`, response.statusText);
        // throw new Error(`Failed to fetch movies: ${response.statusText}`)
    }

    const data = await response.json();

    return data.results;
};
