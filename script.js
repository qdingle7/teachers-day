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
    // Photobooth strip dimensions
    const stripWidth = 700;
    const photoWidth = 620;
    const photoHeight = 465;

    const sideMargin = 40;
    const topSpace = 125;
    const gap = 20;
    const bottomSpace = 130;

    // Calculate total height
    const stripHeight =
        topSpace +
        (photoHeight * 4) +
        (gap * 3) +
        bottomSpace;

    canvas.width = stripWidth;
    canvas.height = stripHeight;

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
    // HEADER
    // ============================

    ctx.fillStyle = "#333333";

    ctx.font = "bold 42px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "HAPPY TEACHERS' DAY!",
        stripWidth / 2,
        55
    );

    ctx.font = "22px Arial";

    ctx.fillStyle = "#777777";

    ctx.fillText(
        "A memory with your students",
        stripWidth / 2,
        90
    );

    // ============================
    // DRAW FOUR PHOTOS
    // ============================

    photos.forEach((photo, index) => {

        const x = sideMargin;
        const y =
            topSpace +
            index * (photoHeight + gap);

        // White photo border
        ctx.fillStyle = "#eeeeee";

        ctx.fillRect(
            x - 5,
            y - 5,
            photoWidth + 10,
            photoHeight + 10
        );

        // --------------------------------
        // Crop photo without stretching
        // --------------------------------

        const sourceWidth = photo.width;
        const sourceHeight = photo.height;

        const sourceRatio =
            sourceWidth / sourceHeight;

        const targetRatio =
            photoWidth / photoHeight;

        let cropWidth = sourceWidth;
        let cropHeight = sourceHeight;
        let cropX = 0;
        let cropY = 0;

        if (sourceRatio > targetRatio) {

            // Image is too wide
            cropWidth =
                sourceHeight * targetRatio;

            cropX =
                (sourceWidth - cropWidth) / 2;

        } else {

            // Image is too tall
            cropHeight =
                sourceWidth / targetRatio;

            cropY =
                (sourceHeight - cropHeight) / 2;
        }

        ctx.drawImage(
            photo,

            cropX,
            cropY,
            cropWidth,
            cropHeight,

            x,
            y,
            photoWidth,
            photoHeight
        );
    });

    // ============================
    // FOOTER
    // ============================

    const footerY =
        stripHeight - bottomSpace + 40;

    ctx.fillStyle = "#555555";

    ctx.font = "bold 25px Arial";

    ctx.fillText(
        "Thank you for everything!",
        stripWidth / 2,
        footerY
    );

    ctx.font = "20px Arial";

    ctx.fillStyle = "#999999";

    ctx.fillText(
        "Teachers' Day 2026",
        stripWidth / 2,
        footerY + 40
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
