let $snowCanvas;
let snowCtx;
let snowSpeed = 3;
let snowSpeedRandomRange = 4;
let snowSize = 5;
let snowSizeRandomRange = 2;
let snowMinOpacity = 0.2;
let snowMaxOpacity = 0.8;
let snowCount = 2000;
let snowCentury = 0;
let snowCenturyRandomRange = 0;
let mouseRange = 500;
let snows = new Array();
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let snowControllerMove = false;
let $snowController;
let $snowControllerInput;
let $snowMoveBar;
let $snowControllerClose;
let $snowControllerCover;
let snowInput;
let snowOldSpeed = snowSpeed;
let snowOldSize;
let snowOldCentury;
let snowOldMinOpacity;
let snowOldMaxOpacity;
let mouseDownX = 0;
let mouseDownY = 0;
let snowControllerX = 0;
let snowControllerY = 0;
let snowControllerClosed = false;
let maxLimit = true;
let snowControllerRight;
let snowControllerBottom;

function init() {
  $snowCanvas = document.getElementById("snowCanvas");
  snowCtx = $snowCanvas.getContext("2d");
  if(document.getElementById("snowController") !== null) {
    $snowController = document.getElementById("snowController");
    snowControllerHTML();
    $snowController.style.right = 0;
    $snowController.style.bottom = 0;
  }

  $snowCanvas.width = window.innerWidth;
  $snowCanvas.height = window.innerHeight;

  $snowCanvas.style.width = `${$snowCanvas.width}px`;
  $snowCanvas.style.height = `${$snowCanvas.height}px`;

  snowPush(snowCount);
  mouse();
  snowMove();
}

window.addEventListener("resize", function () {
  $snowCanvas.width = window.innerWidth;
  $snowCanvas.height = window.innerHeight;
  
  $snowCanvas.style.width = `${$snowCanvas.width}px`;
  $snowCanvas.style.height = `${$snowCanvas.height}px`;
})

function snowMove() {
  snowCtx.clearRect(0, 0, $snowCanvas.width, $snowCanvas.height);
  snows.forEach((i, idx) => {
    i.y += i.velY;
    if(i.y + i.size < $snowCanvas.height) {
      i.x += i.velX;
      if(i.motionDirection < 2) {
        if(i.motionDirection === 0) i.motionStep++;
        if(i.motionDirection === 1) i.motionStep--;
        i.x += i.motion * i.motionStep;
      }
      if(i.motionDirection > 1) {
        if(i.motionDirection === 2) i.motionStep++;
        if(i.motionDirection === 3) i.motionStep--;
        i.x -= i.motion * i.motionStep;
      }
      if(((i.motionDirection === 0 || i.motionDirection === 2) && i.motionStep >= 50) || ((i.motionDirection === 1 || i.motionDirection === 3) && i.motionStep <= 0)) {
        i.motionDirection++;
        if(i.motionDirection > 3) {
          i.motionDirection = 0;
        }
      }
    }

    if(mouseDown && !snowControllerMove) {
      let dx = i.x - mouseX;
      let dy = i.y - mouseY;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRange) {
        let force = mouseRange / (dist * dist);
        let xcomp = (mouseX - i.x) / dist;
        let ycomp = (mouseY - i.y) / dist;

        i.velX -= force * xcomp * 2;
        i.velY -= force * ycomp * 2;
      }
    }

    if(i.y + i.size > $snowCanvas.height) {
      i.y = $snowCanvas.height - i.size;
      i.alpha -= 0.01;
      if(i.size > 0.1) i.size -= 0.1;
      else recycle(idx);
      if(i.alpha < 0) recycle(idx);
    }
    if(i.y < i.startY) recycle(idx);

    if(i.velX !== i.wind) {
      i.velX += (i.wind - i.velX) / 50;
      if(i.velX > i.wind + 0.01 && i.velX < i.wind - 0.01) i.velX = i.wind;
    }
    if(i.velY !== i.speed) {
      i.velY += (i.speed - i.velY) / 50;
      if(i.velY > i.speed + 0.01 && i.velY < i.speed - 0.01) i.velY = i.speed;
    }

    snowCtx.fillStyle = `rgba(255, 255, 255, ${i.alpha})`;
    snowCtx.arc(i.x, i.y, i.size, 0, Math.PI * 2);
    snowCtx.fill();
    snowCtx.beginPath();
  })
  requestAnimationFrame(snowMove);
}

function snowPush(count) {
  for(let i = 0; i < count; i++) {
    let x = Math.random() * ($snowCanvas.width * 3) - $snowCanvas.width;
    let y = Math.random() * ($snowCanvas.height + 100 + ($snowCanvas.height / 10 * snowSpeed)) - 90 - ($snowCanvas.height / 10 * snowSpeed);
    let size = Math.random() * snowSizeRandomRange + snowSize - snowSizeRandomRange / 2;
    let speed = Math.random() * snowSpeedRandomRange + snowSpeed - snowSpeedRandomRange / 2;
    let wind = Math.random() * snowCenturyRandomRange + snowCentury - snowCenturyRandomRange / 2;
    let alpha = Math.random() * (snowMaxOpacity - snowMinOpacity) + snowMinOpacity;
    let motion = Math.random() * size * 0.002;
    let motionDirection = Math.floor(Math.random() * 4);
    let motionStep = Math.floor(Math.random() * 50);
    if(y + size > $snowCanvas.height) y = $snowCanvas.height - size;
    snows.push({x: x, y: y, velX: wind, velY: speed, speed: speed, wind: wind, size: size, alpha: alpha, motion: motion, motionStep: motionStep, motionDirection: motionDirection, startY: y});
  }
}

function recycle(idx) {
  let x = Math.random() * ($snowCanvas.width * 3) - $snowCanvas.width;
  let y = -10 - ($snowCanvas.height / 20 * snowSpeed);
  let size = Math.random() * snowSizeRandomRange + snowSize - snowSizeRandomRange / 2;
  let speed = Math.random() * snowSpeedRandomRange + snowSpeed - snowSpeedRandomRange / 2;
  let wind = Math.random() * snowCenturyRandomRange + snowCentury - snowCenturyRandomRange / 2;
  let alpha = Math.random() * (snowMaxOpacity - snowMinOpacity) + snowMinOpacity;
  let motion = Math.random() * size * 0.002;
  let motionDirection = Math.floor(Math.random() * 4);
  let motionStep = Math.floor(Math.random() * 50);
  if(snowCentury > 0) x - $snowCanvas.width;
  if(snowCentury < 0) x + $snowCanvas.width;
  snows[idx] = {x: x, y: y, velX: wind, velY: speed, speed: speed, wind: wind, size: size, alpha: alpha, motion: motion, motionStep: motionStep, motionDirection: motionDirection, startY: y};
}

function mouse() {
  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if(snowControllerMove) {
      let x = mouseX;
      let y = mouseY;
      if(x > window.innerWidth) x = window.innerWidth - 1;
      if(x < 0) x = 1;
      if(y > window.innerHeight) y = window.innerHeight -   1;
      if(y < 0) y = 1;
      $snowController.style.right = `${snowControllerX + mouseDownX - x}px`;
      $snowController.style.bottom = `${snowControllerY + mouseDownY - y}px`;
    }
  })
  
  document.addEventListener("mousedown", e => {
    if(e.target === $snowCanvas) {
      mouseDown = true;
      if(hasClass($snowController, "icon")) $snowController.style.display = "none";
    }
    if(e.target === $snowMoveBar) snowControllerMove = true;
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    snowControllerX = Number($snowController.style.right.replace(/px/gi, ""));
    snowControllerY = Number($snowController.style.bottom.replace(/px/gi, ""));
  })
  
  document.addEventListener("mouseup", e => {
    mouseDown = false;
    snowControllerMove = false;
    $snowController.style.display = "";
  })

  $snowControllerClose.addEventListener("click", e => {
    if(!snowControllerClosed) {
      $snowController.classList.add("icon");
      $snowControllerCover.style.opacity = "1";
      $snowController.style.transition = "0.5s, opacity 0.5s 1s";
      snowControllerRight = $snowController.style.right;
      snowControllerBottom = $snowController.style.bottom;
      $snowController.style.right = "";
      $snowController.style.bottom = "";
      setTimeout(e => {
        snowControllerClosed = true;
        $snowController.style.transition = "";
      },500)
    }
  })

  $snowController.addEventListener("click", e => {
    if(snowControllerClosed) {
      $snowController.classList.remove("icon");
      $snowController.style.transition = "0.5s";
      $snowController.style.right = snowControllerRight;
      $snowController.style.bottom = snowControllerBottom;
      setTimeout(e => {
        $snowControllerCover.style.opacity = "";
          snowControllerClosed = false;
          $snowController.style.transition = "";
      },500)
    }
  })
}

function snowControllerHTML() {
  $snowController.innerHTML = `
    <div id="snowMoveBar"><span id="snowControllerClose">_</span></div>
    <div id="snowInput">
      <div id="snowSpeed" class="snowSubInput">
        <div class="snowNormalInput">
          <p>snow speed</p>
          <input type="number" id="snowSpeedNumber" min="1" max="50" value="3">
          <input type="range" id="snowSpeedRange" min="1" max="50" value="3">
        </div>
        <div class="snowRandomInput">
          <p>snow speed random range</p>
          <input type="number" id="snowSpeedRandomNumber" min="0" max="10" value="4">
          <input type="range" id="snowSpeedRandomRange" min="0" max="10" value="4">
        </div>
      </div>
      <div id="snowSize" class="snowSubInput">
        <div class="snowNormalInput">
          <p>snow size</p>
          <input type="number" id="snowSizeNumber" min="1" max="50" value="5">
          <input type="range" id="snowSizeRange" min="1" max="50" value="5">
        </div>
        <div class="snowRandomInput">
          <p>snow size random range</p>
          <input type="number" id="snowSizeRandomNumber" min="0" max="10" value="2">
          <input type="range" id="snowSizeRandomRange" min="0" max="10" value="2">
        </div>
      </div>
      <div id="snowCentury" class="snowSubInput">
        <div class="snowNormalInput">
          <p>wind century</p>
          <input type="number" id="snowCenturyNumber" min="-5" max="5" value="0">
          <input type="range" id="snowCenturyRange" min="-5" max="5" value="0">
        </div>
        <div class="snowRandomInput">
          <p>wind century random range</p>
          <input type="number" id="snowCenturyRandomNumber" min="0" max="4" value="0">
          <input type="range" id="snowCenturyRandomRange" min="0" max="4" value="0">
        </div>
      </div>
      <div id="snowOpacity">
        <div id="snowMin">
          <p>snow min opacity</p>
          <input type="number" id="snowMinOpacityNumber" min="0" max="1" step="0.05" value="0.2">
          <input type="range" id="snowMinOpacityRange" min="0" max="1" step="0.05" value="0.2">
        </div>
        <div id="snowMax">
          <p>snow max opacity</p>
          <input type="number" id="snowMaxNumberOpacity" min="0" max="1" step="0.05" value="0.8">
          <input type="range" id="snowMaxRangeOpacity" min="0" max="1" step="0.05" value="0.8">
        </div>
      </div>
      <div id="snowCount">
        <p>snow count</p>
        <input type="number" id="snowCountNumber" min="0" max="5000" value="2000">
        <input type="range" id="snowCountRange" min="0" max="5000" value="2000">
      </div>
      <div id="snowMouseRange">
        <p>mouse range</p>
        <input type="number" id="snowMouseNumber" min="0" max="5000" value="500">
        <input type="range" id="snowMouseRange" min="0" max="5000" value="500">
      </div>
    </div>
    <div id="snowControllerCover"></div>
  `
  $snowControllerInput = document.querySelectorAll("#snowInput input");
  $snowMoveBar = document.getElementById("snowMoveBar");
  $snowControllerClose = document.getElementById("snowControllerClose");
  $snowControllerCover = document.getElementById("snowControllerCover");
  snowInput = {speed: [], speedRange: [], size: [], sizeRange: [], century: [], centuryRange: [], opacityMin: [], opacityMax: [], count: [], mouse: []};

  $snowControllerInput.forEach(i => {
    i.addEventListener("input", e => {
      let input = e.target.closest("div").querySelectorAll("input");
      let value = Number(e.target.value);
      let min = Number(e.target.getAttribute("min"));
      let max = Number(e.target.getAttribute("max"));
      let id = e.target.id.replace(/snow|Range|Number/gi, "")
      let mCentury = false;

      if(id.replace(/Random/gi, "") === "Century" && value < 0) {
        mCentury = true;
        value *= -1;
      }

      if(hasClass(e.target.closest("div"), "snowRandomInput")) {
        let normalInput = e.target.closest(".snowSubInput").querySelectorAll(".snowNormalInput input");
        let normalValue = Number(normalInput[0].value);
        if(normalValue < 0) normalValue *= -1;
        if(value > normalValue * 2) {
          value = normalValue * 2;
        }
      }
      if(hasClass(e.target.closest("div"), "snowNormalInput")) {
        let randomInput = e.target.closest(".snowSubInput").querySelectorAll(".snowRandomInput input");
        let randomValue = Number(randomInput[0].value);
        if(value * 2 < randomValue) {
          randomValue = value * 2;
          randomInput.forEach(v => v.value = randomValue);
          switch(id) {
            case "Speed": snowSpeedRandomRange = randomValue; break;
            case "Size": snowSizeRandomRange = randomValue; break;
            case "Century": snowCenturyRandomRange = randomValue; break;
          }
        }
      }
      if(value < min) {
        value = min;
        if(value < 0) {
          input.forEach(v => v.value = "");
        }
      }else if(value > max && maxLimit) {
        value = max;
        input.forEach(v => v.value = value);
      }else {
        if(mCentury) input.forEach(v => v.value = value * -1);
        else if(e.target.value !== "") input.forEach(v => v.value = value);
      }
      if(e.target.closest("div").id.replace(/snow/gi, "") === "Max") {
        let minInput = e.target.closest("#snowOpacity").querySelectorAll("#snowMin input");
        let minValue = Number(minInput[0].value);
        if(value < minValue) {
          minInput.forEach(v => v.value = value);
          snowMinOpacity = value;
        }
      }
      if(e.target.closest("div").id.replace(/snow/gi, "") === "Min") {
        let maxInput = e.target.closest("#snowOpacity").querySelectorAll("#snowMax input");
        let maxValue = Number(maxInput[0].value);
        if(value > maxValue) {
          maxInput.forEach(v => v.value = value);
          snowMaxOpacity = value;
        }
      }
      if(mCentury) value *= -1;
      switch(id) {
        case "Speed": snowSpeed = value; break;
        case "SpeedRandom": snowSpeedRandomRange = value; break;
        case "Size": snowSize = value; break;
        case "SizeRandom": snowSizeRandomRange = value; break;
        case "Century": snowCentury = value; break;
        case "CenturyRandom": snowCenturyRandomRange = value; break;
        case "MinOpacity": snowMinOpacity = value; break;
        case "MaxOpacity": snowMaxOpacity = value; break;
        case "Count": snowCount = value; break;
        case "Mouse": mouseRange = value; break;
      }
    })
    i.addEventListener("blur", e => {
      if(e.target.value === "") e.target.value = e.target.getAttribute("min");
    })
  })
}

function hasClass(element, className) {
  return element.classList.contains(className);
};

window.onload = init;