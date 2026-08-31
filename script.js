const startButton = document.getElementById("startButton");
const captureButton = document.getElementById("captureButton");
const downloadButton = document.getElementById("downloadButton");
const retakeButton = document.getElementById("retakeButton");

const cameraSection = document.getElementById("cameraSection");
const resultSection = document.getElementById("resultSection");

const video = document.getElementById("video");
const photoCounter = document.getElementById("photoCounter");
const canvas = document.getElementById("photoCanvas");

let stream = null;
let photos = [];
let currentPhoto = 0;


// ================================
// START CAMERA
// ================================

startButton.addEventListener("click", async () => {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Your browser does not support camera access.");
            return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: {
                    ideal: 1280
                },
                height: {
                    ideal: 720
                }
            },
            audio: false
        });

        video.srcObject = stream;

        await video.play();

        photos = [];
        currentPhoto = 0;

        startButton.classList.add("hidden");
        cameraSection.classList.remove("hidden");
        resultSection.classList.add("hidden");

        captureButton.disabled = false;

        updateCounter();

    } catch (error) {
        console.error("Camera error:", error);

        if (error.name === "NotAllowedError") {
            alert(
                "Camera access was denied. Please allow camera access in your browser settings and try again."
            );
        } else if (error.name === "NotFoundError") {
            alert(
                "No camera was found on this device."
            );
        } else {
            alert(
                "We couldn't access the camera. Please make sure your camera is available and try again."
            );
        }
    }
});


// ================================
// TAKE PHOTO
// ================================

captureButton.addEventListener("click", async () => {
    if (!stream || video.readyState < 2) {
        alert("Camera isn't ready yet. Please wait a moment.");
        return;
    }

    captureButton.disabled = true;

    await countdown();

    takePhoto();

    currentPhoto++;

    if (currentPhoto < 4) {
        updateCounter();

        setTimeout(() => {
            captureButton.disabled = false;
        }, 500);

    } else {
        finishPhotos();
    }
});


// ================================
// COUNTDOWN
// ================================

function countdown() {
    return new Promise((resolve) => {
        let count = 3;

        photoCounter.textContent = count;

        const timer = setInterval(() => {
            count--;

            if (count > 0) {
                photoCounter.textContent = count;
            } else {
                clearInterval(timer);

                photoCounter.textContent = "CHEESE!";

                flashScreen();

                setTimeout(resolve, 450);
            }
        }, 1000);
    });
}


// ================================
// CAMERA FLASH EFFECT
// ================================

function flashScreen() {
    document.body.classList.add("camera-flash");

    setTimeout(() => {
        document.body.classList.remove("camera-flash");
    }, 150);
}


// ================================
// TAKE PHOTO
// ================================

function takePhoto() {
    const photoCanvas = document.createElement("canvas");

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
        console.error("Camera dimensions are unavailable.");
        return;
    }

    photoCanvas.width = width;
    photoCanvas.height = height;

    const ctx = photoCanvas.getContext("2d");

    // Mirror the image so it looks like a normal selfie
    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(
        video,
        0,
        0,
        width,
        height
    );

    photos.push(photoCanvas);
}


// ================================
// UPDATE COUNTER
// ================================

function updateCounter() {
    photoCounter.textContent =
        `Photo ${currentPhoto + 1} of 4`;
}


// ================================
// FINISH PHOTOS
// ================================

function finishPhotos() {
    stopCamera();

    cameraSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    createPhotobooth();
}


// ================================
// STOP CAMERA
// ================================

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });

        stream = null;
    }

    video.srcObject = null;
}


// ================================
// CREATE FINAL PHOTO
// ================================

function createPhotobooth() {
    const photoWidth = 600;
    const photoHeight = 450;

    const spacing = 15;

    const topSpace = 80;
    const bottomSpace = 100;

    canvas.width =
        (photoWidth * 2) +
        (spacing * 3);

    canvas.height =
        topSpace +
        (photoHeight * 2) +
        (spacing * 3) +
        bottomSpace;

    const ctx = canvas.getContext("2d");

    // ============================
    // BACKGROUND
    // ============================

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ============================
    // TITLE
    // ============================

    ctx.fillStyle = "#333333";

    ctx.font = "bold 38px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "Happy Teachers' Day!",
        canvas.width / 2,
        48
    );


    // ============================
    // DRAW PHOTOS
    // ============================

    photos.forEach((photo, index) => {

        const column = index % 2;

        const row = Math.floor(index / 2);

        const x =
            spacing +
            column * (photoWidth + spacing);

        const y =
            topSpace +
            spacing +
            row * (photoHeight + spacing);

        ctx.drawImage(
            photo,
            x,
            y,
            photoWidth,
            photoHeight
        );
    });


    // ============================
    // BOTTOM MESSAGE
    // ============================

    ctx.fillStyle = "#666666";

    ctx.font = "24px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "Thank you for making every class memorable!",
        canvas.width / 2,
        canvas.height - 55
    );

    ctx.font = "18px Arial";

    ctx.fillStyle = "#999999";

    ctx.fillText(
        "Teachers' Day 2026",
        canvas.width / 2,
        canvas.height - 25
    );
}


// ================================
// DOWNLOAD PHOTO
// ================================

downloadButton.addEventListener("click", () => {

    const link = document.createElement("a");

    link.download = "Teachers-Day-Photobooth-2026.png";

    link.href = canvas.toDataURL("image/png");

    link.click();
});


// ================================
// RETAKE
// ================================

retakeButton.addEventListener("click", () => {

    stopCamera();

    resultSection.classList.add("hidden");

    cameraSection.classList.add("hidden");

    startButton.classList.remove("hidden");

    photos = [];

    currentPhoto = 0;

    captureButton.disabled = false;

    photoCounter.textContent = "Photo 1 of 4";
});


// ================================
// CLEANUP IF PAGE IS CLOSED
// ================================

window.addEventListener("beforeunload", () => {
    stopCamera();
});
