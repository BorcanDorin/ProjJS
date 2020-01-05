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

function initialLoad() {
  playSong();
  playerID = setInterval(playSong, 286000); //(4 * 60 + 45 + 1) *  1000);//4' 45" length song + one sec buffer
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

function playSong() {
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

function stopSong() {
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

function sendForm() {
  //alert("hello!");
  var form = document.getElementById("formId");
  var email = form.elements['email'].value;
  var psw = form.elements['psw'].value;
  var pswConf = form.elements['psw-repeat'].value;
  if(checkEmail(email)){
    console.log(email);
  }
  if(checkPsw(psw)){
    console.log(psw);
  }
  if(psw != pswConf){
    console.log('error');
  }
}

function checkEmail(text) {
  var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!filter.test(text)) {
    alert('Please provide a valid email address');
    return false;
  }
  return true;
}

function checkPsw(text){
  var filter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  if(!filter.test(text)){
    alert('The password must contain at least one uppercase, one lowercase, one number, one special character and must be at least 8 characters long!')
    return false;
  }
  return true;
}