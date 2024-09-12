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

export default function GamePage ({ params }) {
    const router = useRouter(); // Usar useRouter para obtener el objeto router

    // Renderizar los detalles del juego una vez que los datos estén disponibles
    return (
        <div className="container mx-auto p-4">
            {params.id}
        </div>
    );
};

// export default GamePage;
