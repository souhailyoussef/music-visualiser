const X_RAPID_API_KEY = '0dbd38fc8dmsh7004146a64a1761p17226ejsnceab381ff0ef';
const X_RAPID_API_HOST = 'youtube-mp3-downloader2.p.rapidapi.com';
const canvas = document.getElementById('canvas');
const container = document.getElementById('container');
const audioFileInput = document.getElementById('file');
const audio1 = document.getElementById('audio');
const anchor = document.getElementById('anchor');

const ctx = canvas.getContext('2d');
let MAX_VALUE = 0;

let audioSource;
let analyser;

container.addEventListener('click', () => {
    playSound(shape)
});

let shape = 'bar';

document.querySelectorAll('input[name="shape"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.checked) {
            playSound(this.value); // Call playSound function with the selected shape value
        }
    });
});
audioFileInput.addEventListener('change', function() {
    const file = audioFileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
      audio1.src = event.target.result;
      playSound(shape);
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  });

function playSound(shape) {
    const audioCtx = new AudioContext();
    audio1.load();
    audio1.play();
    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 512; // number of bars to display
    const bufferLength = analyser.frequencyBinCount; 
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;

    let x;
    function animate() {
        x = 0;
        ctx.clearRect(0,0,canvas.width, canvas.height)
        analyser.getByteFrequencyData(dataArray);
        MAX_VALUE = findMaxValue(dataArray);
        if (shape === 'bar') {
            drawBarVisualiser(bufferLength, dataArray, x, barWidth);
        } else {
            drawCircleVisualiser(bufferLength, dataArray, x , barWidth);
        }
        requestAnimationFrame(animate);

    }

    animate();
}

function drawBarVisualiser(bufferLength, dataArray, x, barWidth) {
    let barHeight;
    for (let i=0; i< bufferLength; i++) {
        barHeight = calculateBarHeight(dataArray[i]);
        ctx.fillStyle = `hsl(${i+270}, ${84+i}%, ${69}%)`;

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
        ctx.rotate(i + Math.PI*5);
        ctx.fillStyle = `hsl(${Math.max(270, i,  i+270)}, ${84+i}%, ${69}%)`;
        ctx.fillRect(0, 0, barWidth*3, barHeight);
        x+= barWidth;
        ctx.restore();
    }
}

function calculateBarHeight(value) {
    return (value / MAX_VALUE)*canvas.height - 5; 
}

function calculateBarHeightForCircle(value) {
    return (value / MAX_VALUE)*(canvas.height/2) - 5; 
}

function findMaxValue(dataArray) {
    let max = 0;

    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > max) {
            max = dataArray[i];
        }
    }
    return max;
}


function downloadAudio(link) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': X_RAPID_API_KEY,
            'X-RapidAPI-Host': X_RAPID_API_HOST
        }
    };
    
    
    let url = `https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/?url=${link}`;
    let x;
    fetch(url, options)
        .then(response => response.json())
        .then(response => {
            x = response.dlink;
            downloadMP3(x)    
        })
        .catch(err => console.error(err));
}

function downloadMP3(url) {
    url = "https://mymp3.xyz/phmp3?fname=Q83ZxBBb-uM128.mp3"
    console.log(url)
     fetch(url)
    .then(response => response.json())
    .then(res => res)
    .catch(err => console.error(err))
    .finally(() => console.log('im here'))
}
