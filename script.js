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

pbEx.style.display = "none";

// Input listeners
frVal.addEventListener("change", function(){ frRate = Number(frVal.value); });
rrVal.addEventListener("change", function(){ rrRate = Number(rrVal.value); });
prVal.addEventListener("change", function(){ prRate = Number(prVal.value); });

pbInputs.forEach(element => {
  element.addEventListener("change", function() {
    pbEx.style.display = document.querySelector('input[name="pb"]:checked').value === "yes" ? "block" : "none";
  });
});

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
  
  // Perfect alignment - integer ratio
  if (fr % rr === 0 || rr % fr === 0) {
    return 0;
  }
  
  // Calc (calculator) the error
  const ratio = fr / rr;
  
  if (fr > rr) {
    // FPS > Hz: frames get skipped :(
    const idealFramesPerRefresh = fr / rr;
    const fractionalPart = idealFramesPerRefresh - Math.floor(idealFramesPerRefresh);
    return fractionalPart * 100;
  } else {
    // FPS < Hz: frames get duplicated  :(  :(
    const idealRefreshesPerFrame = rr / fr;
    const fractionalPart = idealRefreshesPerFrame - Math.floor(idealRefreshesPerFrame);
    return fractionalPart * 100;
  }
}

function calcStutterVal(){
  if (!frRate || !rrRate) {
    alert("Please set both framerate and refresh rate first!");
    return;
  }
  
  const usePhysicsBypass = document.querySelector('input[name="pb"]:checked').value === "yes";
  const physicsRate = usePhysicsBypass ? prRate : 240;
  
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
    resultHTML += `<p>- Please, either make sure you play at the ideal framerate. OR, if Frame Extrapolation is out, use that.</p>`;
  } else {
    resultHTML += `<p>No specific recommendations needed for CBF/COS users. Good Job.</p>`;
  }
  
  resultHTML += `</div></details>`;
  
  resultHTML += `<details class="dropdown cbf-dropdown">`;
  resultHTML += `<summary><b>If you DON'T use CBF or COS</b></summary>`;
  resultHTML += `<div class="dropdown-content">`;
  
  if (frRate < prRate || physicsDesync !== 0) {
    resultHTML += `<h4>Due to your physics desync or playing at a lower framerate than the physics rate (${prRate}):</h4>`;
    resultHTML += `<p>- Make sure you are playing at ${idealFramerate} FPS. If it seems too high, either decrease your refresh rate to have a lower ideal framerate w/ the physics rate, or just enable COS or CBF.</p>`;
    resultHTML += `<p>- Also, You are actively missing inputs by not using (at the very least), COS. It's allowed by the official leaderboard even for verifications if you care about that. If your leaderboard allows CBF (I.E. Pointercrate, AREDL, Challenge List), use that instead.</p>`;
  }
  
  if (displayStutter !== 0) {
    resultHTML += `<h4>Due to your display stutter:</h4>`;
    resultHTML += `<p>- Please, make sure you play at ${idealFramerate} FPS. AND, if Frame Extrapolation is out, use that too.</p>`;
  }
  
  resultHTML += `<h4>Disclaimer:</h4>`;
  resultHTML += `<p>- Even if you drop frames once, you will miss inputs. Please consider either COS (if you are a robtop-fearing man) or CBF (if you play for the right leaderboards!!!).</p>`;
  
  resultHTML += `</div></details>`;
  
  resultHTML += `<details class="dropdown" open>`;
  resultHTML += `<summary><b>In General</b></summary>`;
  resultHTML += `<div class="dropdown-content">`;
  resultHTML += `<p>- If Frame Extrapolation is out, absolutely use it :) (no pun intended). It only visually changes the game to make it more smooth, nothing that could constitute a rule on a LB for it. Please just use it no matter what.</p>`;
  resultHTML += `</div></details>`;
    
    resultsDiv.innerHTML = resultHTML;
    
    //Dropout johnsons
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

// Hello buddy
startButton.addEventListener("click", calcStutterVal);
