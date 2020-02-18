// $(".playMusic").on("click", function(e) {
// 	e.preventDefault();
// 	const music = document.querySelector("#audio3");
// 	music.currentTime = 0;
// 	music.play();
// });

// const isMusicOn = [];
// const musicStartSec = [0,0,71];
// let currentMusicIdx = 0;

// for(let i=0, len=3; i<len ;i++){
// 	isMusicOn[i] = false;
// }

// $(document).on('click', function() {

//     $(document).on('scroll', function() {
// 	    if($(this).scrollTop() >= $('#people'+(i+1)).position().top - (window.screen.height/2)){
// 	        currentMusicIdx = i;
// 	        getSoundAndFadeAudio("audio"+(i+1), musicStartSec[i]);
// 	        $(document).off('scroll');
// 	    }
// 	})
// 	$(document).off('click');
// })

// function getSoundAndFadeAudio(audiosnippetId, currentTime) {
//     const sound = document.getElementById(audiosnippetId);
// 	sound.currentTime = currentTime;

// 	// Fade in for 2 secs
//     const fadePoint = currentTime+2; 
//     const fadeAudio = setInterval(function () {
//         if ((sound.currentTime <= fadePoint) && (sound.volume < 1.0)) {
//             sound.volume += 0.1;
//         }
//         if (sound.volume >= 1.0) {
//             clearInterval(fadeAudio);
//         }
//     }, 200);

// 	sound.play();
// 	sound.volume = 0.0;
// }