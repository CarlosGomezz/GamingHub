const express = require('express');
const path = require('path');
const app = express()
const port = process.env.PORT || 3001

const multer = require('multer');


app.get('/', (req, res) => {
    res.send('Hello People');
});


const videoStorage = multer.diskStorage({
    destination: 'videos', // Destination to store video 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 10000000 // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        // upload only mp4 and mkv format
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
            return cb(new Error('Please upload a video'))
        }
        cb(undefined, true)
    }
})

app.post('/uploadVideo', videoUpload.single('video'), (req, res) => {
    console.log("YOYOYOYOY");
    res.send(req.file);  // Envía solo los detalles del archivo subido
}, (error, req, res, next) => {
    res.status(400).json(send({ error: error.message }));
});


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})