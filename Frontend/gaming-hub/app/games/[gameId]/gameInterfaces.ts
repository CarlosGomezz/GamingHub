export interface GameDetails {
    id: number;
    name: string;
    description: string;
    background_image: string;
    released: string;
    rating: number;
    developers: {
        id: number;
        name: string;
        games_count: number;
        image_background: string;
        slug: string;
    }[];
}

export interface GameEditions {
    id: number;
    name: string;
    background_image: string;
}

export interface Video {
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

export interface Achievement {
    id: number;
    name: string;
    description: string;
    image?: string;
    percent: number;
}
