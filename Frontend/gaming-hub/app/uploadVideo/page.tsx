// pages/uploadVideo.tsx
'use client'

import { useState } from 'react';

const UploadVideo: React.FC = () => {
    const laravelURL = process.env.NEXT_PUBLIC_LARAVEL_URL;
    const [videoCreatorId, setVideoCreatorId] = useState<number | null>(1);
    const [videoTitle, setVideoTitle] = useState<string>("");
    const [videoDescription, setVideoDescription] = useState<string>("");
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];  // Formato YYYY-MM-DD
    const [videoDate, setVideoDate] = useState<string>(formattedDate);  // El estado debe ser de tipo string

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    /**
     * 
     * @param e Función saber cuando hay un cambio a la hora de elegir el archivo
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };


    /**
     * 
     * @param e Función para subir el vídeo a la BBDD
     * @returns 
     */
    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            setUploadStatus('Please select a video.');
            return;
        }
        setVideoCreatorId(1); // PUESTO DE MANERA PROVISIONAL

        const formData = new FormData();
        formData.append('video_data', selectedFile);
        formData.append('content_creator_id', String(videoCreatorId));
        formData.append('title', videoTitle);
        formData.append('description', videoDescription);
        formData.append('date', videoDate);

        formData.forEach((value, key) => {
            console.log(`${key}:`, value);
        });


        try {
            console.log(laravelURL + '/api/uploadVideo');

            //   const response = await fetch('http://localhost:3001/uploadVideo', {
            const response = await fetch(`${laravelURL}/api/uploadVideo`, {
                method: 'POST',
                body: formData,
            });

            // Check if response is OK (status 200-299)
            if (response.ok) {
                const result = await response.json(); // Assuming the backend responds with JSON
                setUploadStatus('Video uploaded successfully.');
                console.log('Uploaded file:', result); // Optionally log the file info
            } else {
                const errorData = await response.json();
                setUploadStatus(`Failed to upload video: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            setUploadStatus('Error occurred while uploading.');
            console.error('Upload error:', error);
        }
    };

    return (
        <div>
            <h1>Upload Video</h1>
            <form onSubmit={handleUpload} className='p-5 border-red-100 border-2'>

                <div>
                    <label id='floating_title'>
                        Title
                    </label>
                    <input
                        value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)}
                        type="text" name="floating_title" id="floating_title"
                        className='text-black'
                        // autoComplete="off"
                        required

                    />
                </div>

                <br></br>
                <div>

                    <label id='floating_description'>
                        Description
                    </label>
                    <input
                        value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)}
                        type="text" name="floating_title" id="floating_title"
                        className='text-black'
                        // autoComplete="off"
                        required

                    />

                </div>
                <br></br>

                {/* <div>
                    <label id='floating_description'>
                        Description
                    </label>
                    <input
                        value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)}
                        type="text" name="floating_title" id="floating_title"
                        className='text-black'
                        // autoComplete="off"
                        required

                    />

                </div> */}
                {/* <br></br> */}


                <div>

                    <input
                        value={videoDate}
                        onChange={(e) => setVideoDate(e.target.value)}
                        type="date"
                        disabled
                    />

                </div>
                <br></br>

                <div>
                    <input type="file" accept="video/*" onChange={handleFileChange} />

                </div>
                <br></br>

                <button type="submit" className='border-4 p-5 bg-red-400'>Upload Video</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export default UploadVideo;
