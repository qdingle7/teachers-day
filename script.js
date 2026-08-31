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

// START CAMERA
startButton.addEventListener("click", async () => {

```
try {

    stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "user"
        },
        audio: false
    });

    video.srcObject = stream;

    startButton.classList.add("hidden");
    cameraSection.classList.remove("hidden");

    photos = [];
    currentPhoto = 0;

    updateCounter();

} catch (error) {

    alert(
        "We couldn't access the camera. Please allow camera access and try again."
    );

    console.error(error);
}
```

});

// TAKE PHOTO BUTTON
captureButton.addEventListener("click", async () => {

```
captureButton.disabled = true;

await countdown();

takePhoto();

currentPhoto++;

if (currentPhoto < 4) {

    updateCounter();

    captureButton.disabled = false;

} else {

    finishPhotos();

}
```

});

// COUNTDOWN
function countdown() {

```
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

            setTimeout(resolve, 400);

        }

    }, 1000);

});
```

}

// TAKE PHOTO
function takePhoto() {

```
const photoCanvas = document.createElement("canvas");

const width = video.videoWidth;
const height = video.videoHeight;

photoCanvas.width = width;
photoCanvas.height = height;

const ctx = photoCanvas.getContext("2d");

// Mirror the photo so it looks natural
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
```

}

// UPDATE PHOTO COUNTER
function updateCounter() {

```
photoCounter.textContent =
    `Photo ${currentPhoto + 1} of 4`;
```

}

// FINISH TAKING PHOTOS
function finishPhotos() {

```
if (stream) {

    stream.getTracks().forEach(track => {
        track.stop();
    });

}

cameraSection.classList.add("hidden");

resultSection.classList.remove("hidden");

createPhotobooth();
```

}

// CREATE FINAL PHOTO
function createPhotobooth() {

```
const photoWidth = 600;

const photoHeight = 450;

const spacing = 15;

const topSpace = 70;

const bottomSpace = 90;

canvas.width =
    (photoWidth * 2) +
    (spacing * 3);

canvas.height =
    topSpace +
    (photoHeight * 2) +
    (spacing * 3) +
    bottomSpace;

const ctx = canvas.getContext("2d");

// Background
ctx.fillStyle = "#ffffff";

ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
);


// Title
ctx.fillStyle = "#333333";

ctx.font = "bold 38px Arial";

ctx.textAlign = "center";

ctx.fillText(
    "Happy Teachers' Day!",
    canvas.width / 2,
    48
);


// Draw four photos
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


// Bottom message
ctx.fillStyle = "#666666";

ctx.font = "24px Arial";

ctx.textAlign = "center";

ctx.fillText(
    "Thank you for making every class memorable ❤️",
    canvas.width / 2,
    canvas.height - 35
);
```

}

// DOWNLOAD
downloadButton.addEventListener("click", () => {

```
const link = document.createElement("a");

link.download = "Teachers-Day-Photobooth.png";

link.href = canvas.toDataURL("image/png");

link.click();
```

});

// RETAKE
retakeButton.addEventListener("click", () => {

```
resultSection.classList.add("hidden");

startButton.classList.remove("hidden");

photos = [];

currentPhoto = 0;

photoCounter.textContent = "Photo 1 of 4";
```

});
