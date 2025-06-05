import * as React from "react";
import Typography from "@mui/material/Typography";

// Interfaz para los props de AchievementCard
interface AchievementProps {
    id: number;
    name: string;
    image: string;
    description?: string;
    expanded: boolean; // Ya no necesario, pero lo dejo si lo usas en otro lado
    onChange: (id: number) => void; // Ya no necesario si no vas a usar acordeón
}

const AchievementCard: React.FC<AchievementProps> = ({
    id,
    name,
    image,
    description,
}) => {
    return (
        <div className="border border-gray-700 rounded-lg p-4 shadow-md bg-gray-800">
            <div className="flex items-center justify-between">
                <Typography component="span" variant="h6">
                    {name}
                </Typography>
                <img
                    src={image}
                    alt={name}
                    className="w-8 max-w-md rounded-lg shadow-md"
                />
            </div>
            {description && (
                <Typography className="text-gray-300 text-lg text-center mt-4">
                    {description}
                </Typography>
            )}
        </div>
    );
};

export default AchievementCard;
