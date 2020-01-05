// variables:
var audioContext = new(window.AudioContext || window.webkitAudioContext)();
var source;

var pause5 = document.querySelector('#pause5');
var fullStop = document.getElementsByClassName('fullStop')[0];
var errorDisplay = document.getElementsByTagName('P')[0];

var playerID;
var modal = document.getElementById('id01');


//calls:

initialLoad();
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//functions:

function initialLoad(){
  playSong();
  playerID = setInterval(playSong , 286000); //(4 * 60 + 45 + 1) *  1000);//4' 45" length song + one sec buffer
};

function getSong() {
  source = audioContext.createBufferSource();
  return fetch('../audioResx/hum.ogg')
    .then(function(response) {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      return response.arrayBuffer();
    })
    .then(function(buffer) {
      audioContext.decodeAudioData(buffer, function(decodedData) {
        source.buffer = decodedData;
        source.connect(audioContext.destination);
      });
    });
};

function playSong(){
  getSong()
    .then(function() {
      errorDisplay.innerHTML = '';
      source.start(0);
      pause5.disabled = false;
    })
    .catch(function(error) {
      errorDisplay.appendChild(
        document.createTextNode('Error: ' + error.message)
      );
    });
};

function stopSong(){
  source.stop(0);
  pause5.disabled = true;
}

pause5.onclick = function() {
  stopSong();
  setTimeout(playSong, 5000);
};

fullStop.onclick = function() {
  stopSong();
  fullStop.disabled = true;
  clearInterval(playerID);
}