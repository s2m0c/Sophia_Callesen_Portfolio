// JavaScript for audio playback
const audio1 = new Audio('AE Pics/Playrate.mp3');
const audio2 = new Audio('AE Pics/Podcast_Edit.mp3');

document.getElementById('audioButton1').addEventListener('click', function() {
    if (audio1.paused) {
        audio1.play();
        this.textContent = 'Pause';
    } else {
        audio1.pause();
        this.textContent = 'Loops & Fades';
    }
});

document.getElementById('audioButton2').addEventListener('click', function() {
    if (audio2.paused) {
        audio2.play();
        this.textContent = 'Pause';
    } else {
        audio2.pause();
        this.innerHTML = 'Podcast<br>Edit';
    }
});
