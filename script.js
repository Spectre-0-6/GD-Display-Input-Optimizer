// Holy Variables (Sorry)
const pbInputs = document.querySelectorAll('input[name="pb"]');
const pbEx = document.getElementById("pb-values");
const frVal = document.getElementById("fr");
const rrVal = document.getElementById("rr");
const prVal = document.getElementById("pr");
const startButton = document.getElementById("startB");

let frRate;
let rrRate;

// Vanilla blud
let prRate = 240;

// Input listeners
frVal.addEventListener("change", function(){ frRate = Number(frVal.value); });
rrVal.addEventListener("change", function(){ rrRate = Number(rrVal.value); });
prVal.addEventListener("change", function(){ prRate = Number(prVal.value); });

pbInputs.forEach(element => {
  element.addEventListener("change", function() {
    const isEnabled = document.querySelector('input[name="pb"]:checked').value === "yes";
    prVal.readOnly = !isEnabled;
    prVal.placeholder = isEnabled ? "360, 480, etc.." : "";
    prVal.value = isEnabled ? "" : "240";
  });
});

prVal.readOnly = true;
prVal.value = "240";

// Unified physics rate getter xdddddddddd
function getPhysicsRate() {
  const pbOn = document.querySelector('input[name="pb"]:checked')?.value === "yes";
  return pbOn ? prRate : 240;
}

// Getting LCM ahh blud (AND big boy gcd 🥰)
function gcd(a, b) { 
  return b === 0 ? a : gcd(b, a % b); 
}

function lcm(a, b) { 
  return (a * b) / gcd(a, b); 
}

function calculateStutter(frameRate, refreshRate) {
  const fr = Math.round(frameRate);
  const rr = Math.round(refreshRate);
  
  if (fr % rr === 0 || rr % fr === 0) return 0;
  
  const ratio = fr / rr;
  
  if (fr > rr) {
    const idealFramesPerRefresh = fr / rr;
    const fractionalPart = idealFramesPerRefresh - Math.floor(idealFramesPerRefresh);
    return fractionalPart * 100;
  } else {
    const idealRefreshesPerFrame = rr / fr;
    const fractionalPart = idealRefreshesPerFrame - Math.floor(idealRefreshesPerFrame);
    return fractionalPart * 100;
  }
}

// I LOVE NOT PLANNING AHEAD BLUDDDDDDD!!!!!! XDDDDDD
function reversePairs(arr) {
  let out = [];
  for (let i = arr.length - 2; i >= 0; i -= 2) {
    out.push(arr[i], arr[i+1]);
  }
  return out;
}

// I LOVE NOT PLANNING AHEAD BLUDDDDDDD!!!!!! XDDDDDD// I LOVE NOT PLANNING AHEAD BLUDDDDDDD!!!!!! XDDDDDD// I LOVE NOT PLANNING AHEAD BLUDDDDDDD!!!!!! XDDDDDD// I LOVE NOT PLANNING AHEAD BLUDDDDDDD!!!!!! XDDDDDD// I LOVE NOT PLANNING AHEAD BLUDDDDDDD!!!!!! XDDDDDD
function filterByRefresh(arr, userRR) {
  let out = [];
  for (let i = 0; i < arr.length; i += 2) {
    let hz = arr[i];
    let fps = arr[i+1];
    if (hz < userRR) {
      out.push(hz, fps);
    }
  }
  return out;
}

//THIS ONe kinda weird, but I got it working thankfully. Nested loops be damned.
function calcOtherRR(){
  var text = ``;
  var firstVals=[];
  var secondVals=[];
  var thirdVals=[];
  var check = false;
  let shit;
  let newArr=[];
  let splitKeys=[];
  let splitKeys2=[];
  let newNewArr=[];
  let baseRR = parseInt(document.getElementById("rr").value);

// AHH
function filterPairs(arr){
    let out=[];
    for(let i=0;i<arr.length;i+=2){
      let hz = arr[i];
      let fps = arr[i+1];
      if(hz <= baseRR){
        out.push(hz, fps);
      }
    }
    return out;
}

// Fuckity fuck fuck you!
  const phys = getPhysicsRate();
  for (let j = 1; j < 4; j++) {
    const maxI = Math.floor((phys * j) / 60);
    if (maxI < 2) continue;
    for (let i = 1; i <= maxI; i++) {
      if ((phys * j) % i == 0) {
        const hz = phys * j / i;
        const fps = lcm(phys, hz);
        if (hz <= rrRate && hz !== rrRate) { 
          if(j == 1) { firstVals.push(hz, fps); }
          if(j == 2) { secondVals.push(hz, fps); }
          if(j == 3) { thirdVals.push(hz, fps); }
        }
      }
    }
  }

  text += `<p>- Having a stable ideal framerate if you require to use it is very important. At <b>${prRate}tps</b> physics rate, here are some recommendations. (If you can run the FPS, choose the value closest to your RR):<br>`

  // First factor(EZ)
  if (firstVals.length > 0) 
  {
    firstVals = filterPairs(firstVals);
    if(firstVals.length > 0){
      check = true;
      text += `<p>Some "easy" to run alternatives are:<br>`
      firstVals.forEach(function(currentValue, i) {
        if(i%2 == 0){
          text += `${currentValue}hz => ${firstVals[i+1]}fps<br>`
        }
      });
      text += `</p><br>`;
    }
  }

  // Second factor(not EZ)
  if (secondVals.length > 0) 
  {
    shit = false;

    firstVals.forEach(function(currentValue, i){
      if (i % 2 == 0) {
        splitKeys.push(currentValue);
      }
    });

    secondVals.forEach(function(currentValue2, j){
      if (j % 2 == 0) {
        if (!(splitKeys.includes(currentValue2))) {
          newArr.push(currentValue2);
          newArr.push(secondVals[j+1]);
        }
      }
    });

    secondVals = newArr.slice();

    if(secondVals.length == 0){
      shit=true;
    }

    secondVals = filterPairs(secondVals);

    if(secondVals.length == 0){
      shit = true;
    }

    if(!shit){
      check = true;
      text += `<p>Some "harder" to run alternatives are:<br>`
      secondVals.forEach(function(currentValue, i) {
        if(i%2 == 0){
          text += `${currentValue}hz => ${secondVals[i+1]}fps<br>`
        }
      });
      text += `</p><br>`;
    }
  }

  // Third factor(def not EZ)
  if (thirdVals.length > 0) 
  {
    shit = false;
    newArr=[];
    splitKeys=[];

    firstVals.forEach(function(currentValue, i){
      if (i % 2 == 0) {
        splitKeys.push(currentValue);
      }
    });

    thirdVals.forEach(function(currentValue2, j){
      if (j % 2 == 0) {
        if (!(splitKeys.includes(currentValue2))) {
          newArr.push(currentValue2);
          newArr.push(thirdVals[j+1]);
        }
      }
    });

    secondVals.forEach(function(currentValue, i){
      if (i % 2 == 0) {
        splitKeys2.push(currentValue);
      }
    });

    newArr.forEach(function(currentValue2, j){
      if (j % 2 == 0) {
        if (!(splitKeys2.includes(currentValue2))) {
          newNewArr.push(currentValue2);
          newNewArr.push(newArr[j+1]);
        }
      }
    });

    thirdVals = newNewArr.slice();

    thirdVals = filterPairs(thirdVals);

    if(thirdVals.length == 0){
      shit=true;
    }

    if(!shit){
      check = true;
      text += `<p>Some even harder (likely unnessecary unless it isn't...) alternatives are:<br>`
      thirdVals.forEach(function(currentValue, i) {
        if(i%2 == 0){
          text += `${currentValue}hz => ${thirdVals[i+1]}fps<br>`
        }
      });
      text += `</p>`;
    }
  }

  if(!check){
    text += `<p>Lol I'm sorry twin your physics bypass value is god awful. (or your RR is WAY too low, <60) I'm just gonna assume u are an ILL botter, there's just no reason to actually play at this rate.</p>`;
  }

  return(text);
}

function calcStutterVal(){
  if (!frRate || !rrRate) {
    alert("Please set both framerate and refresh rate first!");
    return;
  }
  
  const physicsRate = getPhysicsRate();

  // Calc le stutters
  const displayStutter = calculateStutter(frRate, rrRate);
  const physicsDesync = calculateStutter(physicsRate, frRate);
  
  // Get LCM for good framerate xdddd
  const physicsHzLcm = lcm(physicsRate, rrRate);
  const idealFramerate = physicsHzLcm;
  
  // Updating or creating results blud!!!!!
  let resultsDiv = document.getElementById('results');
  if (!resultsDiv) {
    resultsDiv = document.createElement('div');
    resultsDiv.id = 'results';
    document.body.appendChild(resultsDiv);
  }
  
  let resultHTML = `<h3>Results:</h3>`;
  resultHTML += `<p><strong>Display Stutter:</strong> ${displayStutter.toFixed(1)}%</p>`;
  resultHTML += `<p><strong>Physics Desync:</strong> ${physicsDesync.toFixed(1)}%</p>`;
  resultHTML += `<p><strong>Ideal Framerate:</strong> ${idealFramerate} FPS</p>`;
  
  if (displayStutter === 0) {
    resultHTML += `<p style="color: green;">No display stuttering detected</p>`;
  }
  if (physicsDesync === 0) {
    resultHTML += `<p style="color: green;">No physics desync detected</p>`;
  }
  
  resultHTML += `<details class="dropdown cbf-dropdown">`;
  resultHTML += `<summary><b>If you use CBF or COS</b></summary>`;
  resultHTML += `<div class="dropdown-content">`;

  if (displayStutter !== 0) {
    resultHTML += `<h4>Due to your display stutter:</h4>`;
    resultHTML += `<p>- If you can't / really dont want to use Frame Extrapolation (for some reason??), play at the ideal FPS.</p>`;
    
    if(idealFramerate > prRate*2 || idealFramerate > rrRate*2){
    resultHTML += `<h4>Due to the high ideal FPS (${idealFramerate}), which may be difficult to run:</h4>`;
    resultHTML += calcOtherRR();
    }

  } 
  
  else {
    resultHTML += `<p>No specific recommendations needed for CBF/COS users. Good Job.</p>`;
  }
  
  resultHTML += `</div></details>`;
  
  resultHTML += `<details class="dropdown cbf-dropdown">`;
  resultHTML += `<summary><b>If you DON'T use CBF or COS</b></summary>`;
  resultHTML += `<div class="dropdown-content">`;
  
  if (frRate < prRate || physicsDesync !== 0) {
    resultHTML += `<h4>Due to your physics desync or playing at a lower framerate than the physics rate (${prRate}tps):</h4>`;
    resultHTML += `<p>- You are actively missing inputs by not using (at the very least), COS. It's allowed by the official leaderboard even for verifications if you care about that. If your leaderboard allows CBF, (I.E. Pointercrate, AREDL, Challenge List), use that instead.</p>`;
    resultHTML += `<p>- Make sure you are playing at ${idealFramerate} FPS to have proper input registration.</p>`;
  }
  
  if (displayStutter !== 0) {
    resultHTML += `<h4>Due to your display stutter:</h4>`;
    resultHTML += `<p>- Please, make sure you play at ${idealFramerate} FPS to have proper smooth display.</p>`;
  }

  if(idealFramerate > prRate*2 || idealFramerate > rrRate*2){
    resultHTML += `<h4>Due to the high ideal FPS (${idealFramerate}), which may be difficult to run:</h4>`;
    resultHTML += calcOtherRR();
  }

  resultHTML += `<h4>Disclaimer:</h4>`;
  resultHTML += `<p>- Even if you drop frames once, you will miss inputs. Please consider either COS (Vanilla Allowed) or CBF.</p>`;
  
  resultHTML += `</div></details>`;
  
  resultHTML += `<details class="dropdown" open>`;
  resultHTML += `<summary><b>In General</b></summary>`;
  resultHTML += `<div class="dropdown-content">`;
  resultHTML += `<p>- Use Frame Extrapolation to maintain smoothness of your game no matter what. This is 100% allowed on any leaderboard, theres no reason not to.</p>`;
  if(rrRate > prRate){
    resultHTML += `<h4>Due to your refresh rate being higher than the physics rate (${prRate}tps):</h4>`;
    resultHTML += `<p><b>- If you don't use Frame Extrapolation, you physically cannot render the game over ${prRate}fps, even if your chosen FPS is the speed the game is running at.</b></p>`;
  }
  resultHTML += `</div></details>`;
    
  resultsDiv.innerHTML = resultHTML;
  
  setTimeout(() => {
    const cbfDropdowns = document.querySelectorAll('.cbf-dropdown');
    cbfDropdowns.forEach(dropdown => {
      dropdown.addEventListener('toggle', function() {
        if (this.open) {
          cbfDropdowns.forEach(other => {
            if (other !== this) other.open = false;
          });
        }
      });
    });
  }, 0);
}

startButton.addEventListener("click", calcStutterVal);
