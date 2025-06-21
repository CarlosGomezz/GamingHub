// endpoints de la API de RAWG.io
export const rawgioEndpoints = {
    gameAchievements: (gameId: string) =>
        `https://rawg.io/api/games/${gameId}/achievements?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page=1`,

    // `https://api.rawg.io/api/games/${gameId}/achievements?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page=1`
};
