const startButton = document.getElementById("startButton");
const captureButton = document.getElementById("captureButton");
const downloadButton = document.getElementById("downloadButton");
const retakeButton = document.getElementById("retakeButton");
const cameraBackButton = document.getElementById("cameraBackButton");

const homeSection = document.getElementById("homeSection");
const cameraSection = document.getElementById("cameraSection");
const resultSection = document.getElementById("resultSection");

const video = document.getElementById("video");
const photoCounter = document.getElementById("photoCounter");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const progressDots =
    document.querySelectorAll(".progress-dot");

const captureHint =
    document.getElementById("captureHint");

const countdownOverlay =
    document.getElementById("countdownOverlay");

const countdownNumber =
    document.getElementById("countdownNumber");

const canvas =
    document.getElementById("photoCanvas");


let stream = null;
let photos = [];
let currentPhoto = 0;


/* =========================================
   START CAMERA
========================================= */

startButton.addEventListener("click", async () => {

    try {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            alert(
                "Your browser does not support camera access."
            );

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


        homeSection.classList.add("hidden");

        resultSection.classList.add("hidden");

        cameraSection.classList.remove("hidden");


        captureButton.disabled = false;


        updateCounter();

        updateProgress();

        updateCaptureHint();


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


/* =========================================
   TAKE PHOTO
========================================= */

captureButton.addEventListener("click", async () => {

    if (
        !stream ||
        video.readyState < 2
    ) {

        alert(
            "Camera isn't ready yet. Please wait a moment."
        );

        return;
    }


    captureButton.disabled = true;


    await countdown();


    takePhoto();


    currentPhoto++;


    if (currentPhoto < 4) {

        updateCounter();

        updateProgress();

        updateCaptureHint();


        setTimeout(() => {

            captureButton.disabled = false;

        }, 500);


    } else {

        updateProgress();

        finishPhotos();
    }
});


/* =========================================
   COUNTDOWN
========================================= */

function countdown() {

    return new Promise((resolve) => {

        let count = 3;


        countdownOverlay.classList.remove("hidden");

        showCountdown(count);


        const timer = setInterval(() => {

            count--;


            if (count > 0) {

                showCountdown(count);

            } else {

                clearInterval(timer);


                showCountdown("CHEESE!");


                flashScreen();


                setTimeout(() => {

                    countdownOverlay.classList.add("hidden");

                    resolve();

                }, 450);
            }

        }, 1000);
    });
}


/* =========================================
   COUNTDOWN DISPLAY
========================================= */

function showCountdown(value) {

    countdownNumber.textContent = value;


    countdownNumber.style.animation = "none";


    void countdownNumber.offsetWidth;


    countdownNumber.style.animation =
        "countdownPop 0.9s ease";
}


/* =========================================
   FLASH
========================================= */

function flashScreen() {

    document.body.classList.add(
        "camera-flash"
    );


    setTimeout(() => {

        document.body.classList.remove(
            "camera-flash"
        );

    }, 180);
}


/* =========================================
   TAKE PHOTO
========================================= */

function takePhoto() {

    const photoCanvas =
        document.createElement("canvas");


    const width = video.videoWidth;

    const height = video.videoHeight;


    if (!width || !height) {

        console.error(
            "Camera dimensions are unavailable."
        );

        return;
    }


    photoCanvas.width = width;

    photoCanvas.height = height;


    const ctx =
        photoCanvas.getContext("2d");


    // Mirror selfie
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


/* =========================================
   UPDATE COUNTER
========================================= */

function updateCounter() {

    photoCounter.textContent =
        `Photo ${currentPhoto + 1} of 4`;
}


/* =========================================
   UPDATE PROGRESS
========================================= */

function updateProgress() {

    const completed =
        Math.max(currentPhoto, 0);


    const percent =
        Math.round(
            (completed / 4) * 100
        );


    progressPercent.textContent =
        `${percent}%`;


    progressFill.style.width =
        `${percent}%`;


    progressDots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentPhoto
        );

        if (currentPhoto === 4) {

            dot.classList.add("active");
        }
    });
}


/* =========================================
   CAPTURE HINT
========================================= */

function updateCaptureHint() {

    const messages = [

        "Ready? Let's get the first one",

        "Nice! One more pose",

        "You're doing great",

        "Last one — make it count!"
    ];


    if (currentPhoto < 4) {

        captureHint.textContent =
            messages[currentPhoto];
    }
}


/* =========================================
   FINISH
========================================= */

function finishPhotos() {

    stopCamera();


    cameraSection.classList.add(
        "hidden"
    );

    resultSection.classList.remove(
        "hidden"
    );


    createPhotobooth();
}


/* =========================================
   STOP CAMERA
========================================= */

function stopCamera() {

    if (stream) {

        stream
            .getTracks()
            .forEach(track => {
                track.stop();
            });


        stream = null;
    }


    video.srcObject = null;
}


/* =========================================
   CREATE PHOTOBOOTH
========================================= */

function createPhotobooth() {

    /*
       TEMPORARY VERSION

       This is still your current
       vertical photo-strip design.

       We'll replace ONLY this function
       later when you give me the final
       photobooth template.
    */


    const stripWidth = 420;

    const photoWidth = 360;

    const photoHeight = 270;

    const sideMargin = 30;

    const topSpace = 95;

    const gap = 10;

    const bottomSpace = 90;


    const stripHeight =
        topSpace +
        (photoHeight * 4) +
        (gap * 3) +
        bottomSpace;


    canvas.width =
        stripWidth;

    canvas.height =
        stripHeight;


    const ctx =
        canvas.getContext("2d");


    /* Background */

    ctx.fillStyle =
        "#fffafc";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Title */

    ctx.fillStyle =
        "#333333";


    ctx.font =
        "bold 27px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "Happy Teachers' Day!",
        stripWidth / 2,
        38
    );


    ctx.font =
        "16px Arial";


    ctx.fillStyle =
        "#888888";


    ctx.fillText(
        "A little memory with your students",
        stripWidth / 2,
        65
    );


    /* Photos */

    photos.forEach((photo, index) => {

        const x =
            sideMargin;


        const y =
            topSpace +
            index *
            (photoHeight + gap);


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            x - 3,
            y - 3,
            photoWidth + 6,
            photoHeight + 6
        );


        const sourceWidth =
            photo.width;


        const sourceHeight =
            photo.height;


        const sourceRatio =
            sourceWidth /
            sourceHeight;


        const targetRatio =
            photoWidth /
            photoHeight;


        let cropWidth =
            sourceWidth;


        let cropHeight =
            sourceHeight;


        let cropX = 0;

        let cropY = 0;


        if (sourceRatio > targetRatio) {

            cropWidth =
                sourceHeight *
                targetRatio;


            cropX =
                (sourceWidth -
                    cropWidth) / 2;

        } else {

            cropHeight =
                sourceWidth /
                targetRatio;


            cropY =
                (sourceHeight -
                    cropHeight) / 2;
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


    /* Footer */

    const footerY =
        stripHeight -
        bottomSpace +
        30;


    ctx.fillStyle =
        "#555555";


    ctx.font =
        "bold 17px Arial";


    ctx.fillText(
        "Thank you for everything!",
        stripWidth / 2,
        footerY
    );


    ctx.font =
        "14px Arial";


    ctx.fillStyle =
        "#999999";


    ctx.fillText(
        "Teachers' Day • 2026",
        stripWidth / 2,
        footerY + 25
    );
}


/* =========================================
   DOWNLOAD
========================================= */

downloadButton.addEventListener(
    "click",
    () => {

        const link =
            document.createElement("a");


        link.download =
            "Teachers-Day-Photobooth-2026.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();
    }
);


/* =========================================
   RETAKE
========================================= */

retakeButton.addEventListener(
    "click",
    () => {

        stopCamera();


        resultSection.classList.add(
            "hidden"
        );

        cameraSection.classList.add(
            "hidden"
        );

        homeSection.classList.remove(
            "hidden"
        );


        photos = [];

        currentPhoto = 0;


        captureButton.disabled =
            false;


        updateCounter();

        updateProgress();

        updateCaptureHint();
    }
);


/* =========================================
   CAMERA BACK BUTTON
========================================= */

cameraBackButton.addEventListener(
    "click",
    () => {

        stopCamera();


        cameraSection.classList.add(
            "hidden"
        );

        homeSection.classList.remove(
            "hidden"
        );


        photos = [];

        currentPhoto = 0;


        captureButton.disabled =
            false;


        updateCounter();

        updateProgress();

        updateCaptureHint();
    }
);


/* =========================================
   CLEANUP
========================================= */

window.addEventListener(
    "beforeunload",
    () => {

        stopCamera();

    }
);
