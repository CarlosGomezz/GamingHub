// pages/game/[id].tsx
'use client'; // Si estás en Next.js 13 o superior con App Router

import { useRouter } from 'next/router'; // Importa useRouter en lugar de useParams
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Define una interfaz para el tipo de datos del juego
interface Game {
    id: string;
    name: string;
    description: string;
    background_image: string;
    released: string;
}

// Función simulada para obtener datos del juego; reemplázala con tu lógica real
const fetchGameById = async (id: string): Promise<Game> => {
    // Aquí podrías hacer una solicitud a tu API con el id del juego
    // Ejemplo: const response = await fetch(`/api/games/${id}`);
    // return await response.json();

    // Simulación de un juego para propósitos de demostración
    return {
        id,
        name: 'Juego de Ejemplo',
        description: `Este es un juego de ejemplo con ID ${id}`,
        background_image: '/path/to/image.jpg',
        released: '2024-01-01',
    };
};

const GamePage = () => {
    const router = useRouter(); // Usar useRouter para obtener el objeto router
    const { id } = router.query as { id: string }; // Extraemos el id desde router.query y aseguramos que es un string
    const [game, setGame] = useState<Game | null>(null); // Define el estado del juego con el tipo Game

    // UseEffect para cargar los datos del juego cuando se monta el componente
    useEffect(() => {
        if (id) {
            fetchGameById(id).then(setGame); // Llamamos a la función para obtener el juego por id
        }
    }, [id]);

    // Mostrar mensaje de carga mientras se recuperan los datos
    if (!game) {
        return <p>Loading...</p>;
    }

    // Renderizar los detalles del juego una vez que los datos estén disponibles
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <p className="text-lg">{game.description}</p>
            <Image src={game.background_image} alt={game.name} width={800} height={400} />
            <p className="text-lg text-center">{game.released}</p>
        </div>
    );
};

export default GamePage;
