const canvas = document.getElementById('canvas');
const container = document.getElementById('container');
const audioFileInput = document.getElementById('file');
const audio1 = document.getElementById('audio');

const ctx = canvas.getContext('2d');
let MAX_VALUE = 0;

let audioSource;
let analyser;

container.addEventListener('click', playSound);

audioFileInput.addEventListener('change', function() {
    const file = audioFileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
      audio1.src = event.target.result;
      playSound();
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  });

function playSound() {
    const audioCtx = new AudioContext();
    audio1.load();
    audio1.play();
    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 2048; // number of bars to display
    const bufferLength = analyser.frequencyBinCount; 
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;

    let x;
    function animate() {
        x = 0;
        ctx.clearRect(0,0,canvas.width, canvas.height)
        analyser.getByteFrequencyData(dataArray);
        MAX_VALUE = findMaxValue(dataArray);
        console.warn(MAX_VALUE);
        drawCircleVisualiser(bufferLength, dataArray, x , barWidth);
        requestAnimationFrame(animate);

    }

    animate();
}

function drawBarVisualiser(bufferLength, dataArray, x, barWidth) {
    let barHeight;
    for (let i=0; i< bufferLength; i++) {
        barHeight = calculateBarHeight(dataArray[i]);
        //ctx.fillStyle = `hsl(${i}, 100%, 50%)`;
        ctx.fillStyle = `hsl(${mapToHue(i)}, 84%, 69%)`;

        ctx.fillRect(canvas.width / 2 + x, canvas.height - barHeight, barWidth, barHeight);
        ctx.fillRect(canvas.width/2 - x, canvas.height - barHeight, barWidth, barHeight);

        ctx.fillStyle = `white`;
        ctx.fillRect(canvas.width / 2 + x, canvas.height - barHeight, barWidth, 2)
        ctx.fillRect(canvas.width /2 - x, canvas.height - barHeight, barWidth, 2)

        x+= barWidth;
    }
}

function drawCircleVisualiser(bufferLength, dataArray, x, barWidth) {
    let barHeight;
    for (let i=0; i< bufferLength; i++) {
        barHeight = calculateBarHeightForCircle(dataArray[i]);
        ctx.save();
        ctx.translate(canvas.width /2, canvas.height/2);
        ctx.rotate(i + Math.PI*8 / bufferLength);
        ctx.fillStyle = `hsl(${mapToHue(i)}, 84%, 69%)`;
        ctx.fillRect(0, 0, barWidth*3, barHeight);
        x+= barWidth;
        ctx.restore();
    }
}

function loadAudioURL(url) {
    audio1.src = url;
    audio1.play();
}

function calculateBarHeight(value) {
    return (value / MAX_VALUE)*canvas.height - 5; 
}

function calculateBarHeightForCircle(value) {
    return (value / MAX_VALUE)*(canvas.height/2) - 5; 
}

function findMaxValue(dataArray) {
    let max = 0;

    // Iterate through the array
    for (let i = 0; i < dataArray.length; i++) {
        // Update max if the current value is greater
        if (dataArray[i] > max) {
            max = dataArray[i];
        }
    }
    return max;
}

function mapToHue(i) {
    const minHue = 272;
    const maxHue = 316;
    const range = (maxHue - minHue)+200;

    let hue = minHue + (i % range);

    if (hue < minHue) {
        hue += range;
    }

    return hue;
}

