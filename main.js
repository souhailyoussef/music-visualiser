const canvas = document.getElementById('canvas');
const container = document.getElementById('container');
const audioFileInput = document.getElementById('file');
const audio1 = document.getElementById('audio');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');


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
    analyser.fftSize = 64; // number of bars to display
    const bufferLength = analyser.frequencyBinCount; 
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let x;
    function animate() {
        x = 0;
        ctx.clearRect(0,0,canvas.width, canvas.height)
        analyser.getByteFrequencyData(dataArray);
        drawCircleVisualiser(bufferLength, dataArray, x , barWidth);
        requestAnimationFrame(animate);

    }

    animate();
}

function drawBarVisualiser(bufferLength, dataArray, x, barWidth) {
    let barHeight;
    for (let i=0; i< bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.fillStyle = 'white';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x+= barWidth;
    }
}

function drawCircleVisualiser(bufferLength, dataArray, x, barWidth) {
    let barHeight;
    for (let i=0; i< bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.save();
        ctx.translate(canvas.width /2, canvas.height/2);
        ctx.rotate(i * 2 * Math.PI / bufferLength);
        ctx.fillStyle = 'rgb(50, 100, 75)';
        ctx.fillRect(0, 0, barWidth, barHeight);
        x+= barWidth;
        ctx.restore();
    }
}