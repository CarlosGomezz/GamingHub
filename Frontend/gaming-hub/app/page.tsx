"use client";
import Image from "next/image";
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Game {
    id: number;
    name: string;
    description: string;
    background_image: string;
    released: string;
}

export default function Home() {
    const [allGames, setAllGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(`https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchGames = async () => {
        if (!nextPageUrl) return; // No more pages to fetch
        setLoading(true);
        setError(null); // Reset any previous error

        try {
            const response = await fetch(nextPageUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            console.log(data.results);

            setAllGames(prevGames => [...prevGames, ...data.results]);
            setNextPageUrl(data.next);  // Update the next page URL

        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();  // Fetch initial games on component mount
    }, []);

    const showGameModal = (game: Game) => {
        console.log("ESTE ES EL GAME: ",    game);
        
    }

    return (
        <main className="">
            <h1 className="text-4xl font-bold text-center pb-10 p-5">Gaming Hub</h1>
            <div className="flex flex-col items-center justify-center">
                {/* <Image
                    src="/images/gaming-hub-logo.png"
                    alt="Gaming Hub Logo"
                    width={200}
                    height={200}
                /> */}
                {/* <p className="text-lg text-center">Welcome to Gaming Hub</p> */}
            </div>

            {/* <Link href={`/game`}>View Games</Link> */}

            <div className="flex flex-wrap justify-center gap-4">
                {allGames.map((game, id) => (
                    
                    <Link
                    onClick={() => showGameModal(game)}
                        href={{
                            pathname: `/${game.id}`, // Ajustamos para usar el ID en la ruta
                        }}
                        key={id}
                        className="flex flex-col w-2/5 md:w-1/4 lg:w-1/5 items-center justify-center bg-gray-800 m-2 p-4 rounded transition-transform transform hover:scale-105 hover:cursor-pointer"
                    >
                        <div>
                            <h2 className="text-2xl font-bold">{game.name}</h2>
                            <Image src={game.background_image} alt={game.name} width={300} height={300} />
                            <p className="text-lg text-center">{game.released}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {loading &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div role="status" className="flex items-center justify-center mt-20">
                        <svg aria-hidden="true" className="inline-flex w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                </div>
            }
            {error && <p className="text-red-500">{error}</p>}

            {nextPageUrl && !loading && !error && (
                <button onClick={fetchGames} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Load More
                </button>
            )}

            <footer className="text-center text-sm">
                <p>&copy; 2024 Gaming Hub</p>
            </footer>

            {showModal && selectedGame && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded text-black max-w-lg w-full">
                        <h2 className="text-2xl font-bold">{selectedGame.name}</h2>
                        <p className="text-lg">{selectedGame.id}</p>
                        <p className="text-lg">{selectedGame.description}</p>
                        <Image
                            src={selectedGame.background_image}
                            alt={selectedGame.name}
                            width={500}
                            height={500}
                            layout="intrinsic" // Cambiado de responsive a intrinsic
                            className="max-w-full h-auto"
                        />
                        <p className="text-lg text-center">{selectedGame.released}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </main>
    );
}
