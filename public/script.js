const video = document.getElementById('video');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

let mediaRecorder;
let recordedChunks = [];

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function() {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);

            // Upload video to server
            const formData = new FormData();
            formData.append('video', blob);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Video uploaded successfully:', data);
            })
            .catch(error => {
                console.error('Error uploading video:', error);
            });

            recordedChunks = [];
        };
    });

startButton.addEventListener('click', () => {
    mediaRecorder.start();
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
});
