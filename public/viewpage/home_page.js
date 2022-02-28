import * as Auth from '../controller/auth.js'
import * as Elements from './elements.js'
import * as Constants from '../model/constants.js'
import {
   updateButtonData, attachRealtimeListener, initFirestoreDocs,
} from '../controller/firestore_controller.js'

let adcDoc, cameraDoc, buttonDoc, lightOn, lightUnknown, lightOff, noImg, cameraButton

export async function home_page() {
  if (!Auth.currentUser) {
    Elements.root.innerHTML = `
        <h3>Not Signed In</h3>
    `;
    return;
  }
  await initFirestoreDocs()
  lightOn = '../model/images/light_on.png'
  lightOff = '../model/images/light_off.png'
  lightUnknown = '../model/images/light_unk.png'
  noImg = '../model/images/distortion.gif'

  let html = '';
  html += `
  <br>
  <div class="light-box">
    Lights:
    <img id="image" src="../model/images/light_unk.png" width="200" height="200">
    Value:
    <div class="value-content" id="value-content">no data</div>
  </div>
  <br>
  <div class="temp-box">
    Temp(Fahrenheit):
    <div class="tempF-content" id="tempF-content">no data</div>
    <br>
    Temp(Celsius):
    <div class="tempC-content" id="tempC-content">no data</div>
  </div>
  <br>
  <br>
  <div>
    <button class="btn" id="camera-button">Take Surveillance Picture</button>
  </div>
  <br>
  <div class="camera-img-box">
    <div id="image-timestamp"></div>
  </div>
  <br>
  <div class="camera-img-box">
    <img id="security-image" src="../model/images/distortion.gif" width="500" height="500">
  </div>

  `;

  Elements.root.innerHTML = html;
 
  adcDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.ADC_DATA, adcListener);
  cameraDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.CAMERA_DATA, cameraListener);
  buttonDoc = attachRealtimeListener(Constants.COLLECTION,
    Constants.BUTTON_DATA, buttonListener);

  cameraButton = document.getElementById('camera-button')
  cameraButton.addEventListener('click', e => {
    updateButtonData({ picButton: true });
    console.log("took pic")
  });
}

function adcListener(doc) {
  const adcData = doc.data()
  if (adcData['value']) {
    document.getElementById('value-content').innerText = adcData['value']
  }
  if (adcData['tempF']) {
    document.getElementById('tempF-content').innerText = adcData['tempF'] + "°F"
  }
  if (adcData['tempC']) {
    document.getElementById('tempC-content').innerText = adcData['tempC'] + "°C"
  }
  if (adcData['lights']) {
    if (adcData['lights'] == "On") {
      document.getElementById('image').src = lightOn
    }
    else if (adcData['lights'] == "Off") {
      document.getElementById('image').src = lightOff
    }
    else if(adcData['lights'] == "?") {
      document.getElementById('image').src = lightUnknown
    }
  }
}

function cameraListener(doc) {
  const cameraDoc = doc.data()
  if (cameraDoc['url'] == null) {
    document.getElementById('security-image').src = noImg
    document.getElementById('image-timestamp').innerText = "--"
  }
  else {
    document.getElementById('security-image').src = cameraDoc['url']
    const timestamp = cameraDoc['timestamp'];
    document.getElementById('image-timestamp').innerText = new Date(timestamp / 1e6).toString();
  }
}

function buttonListener(doc) {
  const buttonDoc = doc.data()
  if (buttonDoc['picButton']) {
    cameraButton.setAttribute("disabled", "")
    cameraButton.innerText = "Loading..."
  }
  else {
    cameraButton.removeAttribute('disabled')
    cameraButton.innerText = "Take Surveillance Picture"
  }
}




