// variables:
var audioContext = new(window.AudioContext || window.webkitAudioContext)();
var source;

var pause5 = document.querySelector('#pause5');
var fullStop = document.getElementsByClassName('fullStop')[0];
var errorDisplay = document.getElementsByTagName('P')[0];
var data = new Array();
var dataError;

var playerID;
var modal = document.getElementById('id01');

const rangeSlider = document.getElementById("formId").elements['age'];
const rangeSliderText = document.getElementById('rangeSlider');


//calls:

loadFromJson();
initialLoad();
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
addList();

rangeSlider.addEventListener('change', updateValue);
document.getElementById('formId').addEventListener('submit', addPost);

//functions:

function initialLoad() {
  playSong();
  playerID = setInterval(playSong, 286000); //(4 * 60 + 45 + 1) *  1000);//4' 45" length song + one sec buffer
  setInterval(addList, 5000);
};

function loadFromJson() {
  //var myObj, i, x = "";
  fetch('../db/myDB.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(json => {
      json.vanat.forEach(myFunction);
      console.log(this.data);
    })
    .catch(function() {
      this.dataError = true;
    })
}

function myFunction(item, index) {
  data.push(item);
}

function addList() {
  document.getElementById("dataList").innerHTML = "";
  var x = "";
  var i = 0;
  for (i = 0; i < data.length; i++) {
    var button = document.createElement("button");
    button.innerHTML = "Delete " + data[i];

    var body = document.getElementById("dataList");
    body.appendChild(button);
    button.onclick = function(i){delete data[i];}
    
  }
  //document.getElementById("dataList").innerHTML = x;
}

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

function checkForm() {
  //alert("hello!");
  var form = document.getElementById("formId");
  var email = form.elements['email'].value;
  var gender = form.elements['gender'].value;
  var age = form.elements['age'].value;
  var security = form.elements['security'].value;
  var psw = form.elements['psw'].value;
  var pswConf = form.elements['psw-repeat'].value;
  if (email === null || psw === null || pswConf == null || checkEmail(email) || checkPsw(psw) || psw != pswConf) {
    //alerta
  }
  //success
}

function checkEmail(text) {
  var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!filter.test(text)) {
    alert('Please provide a valid email address');
    return false;
  }
  return true;
}

function checkPsw(text) {
  var filter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  if (!filter.test(text)) {
    alert('The password must contain at least one uppercase, one lowercase, one number, one special character and must be at least 8 characters long!')
    return false;
  }
  return true;
}

function updateValue(e) {
  rangeSliderText.textContent = e.target.value;
}

function addPost(event) {
  event.preventDefault();

  checkForm();

  var form = document.getElementById("formId");
  var email = form.elements['email'].value;
  var gender = form.elements['gender'].value;
  var age = form.elements['age'].value;
  var security = form.elements['security'].value;
  var psw = form.elements['psw'].value;
  var pswConf = form.elements['psw-repeat'].value;

  const myPost = {
    email: email,
    gender: gender,
    age: age,
    security: security,
    psw: psw
  };

  fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify(myPost)
    })
    .then((res) => res.json())
    .then((e) => alert('Success'))
    .catch(err => console.log('Error message:', err.statusText));

  document.getElementById('id01').style.display = 'none';
  //alert('Success');
}