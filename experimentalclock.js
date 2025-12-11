
let eyesrw = 45;
let eyesrh = 45;
let prevHour = -1;


function setup() {

  const canvas = createCanvas(600, 600);
  canvas.parent("sketch");
}

function draw() {
  drawBackground();   // hour
  drawFaceandBody();  // basic
  drawBelly();        // minute
  drawEyes();         // hour & second
  drawMouth();        // basic
}

// ----------------------
// background (hour)
// ----------------------
function drawBackground() {
  let h = hour();

  let cMorning = color("#f2d096"); // 06
  let cNoon    = color("#00aaff"); // 12
  let cEvening = color("#f28c28"); // 18
  let cNight   = color("#333333"); // 21
  let cLate    = color("#f2d096"); // 24(=0)

  let bg;

  if (h >= 6 && h < 12) {
    bg = lerpColor(cMorning, cNoon, map(h, 6, 12, 0, 1));
  } else if (h >= 12 && h < 18) {
    bg = lerpColor(cNoon, cEvening, map(h, 12, 18, 0, 1));
  } else if (h >= 18 && h < 21) {
    bg = lerpColor(cEvening, cNight, map(h, 18, 21, 0, 1));
  } else if (h >= 21 && h < 24) {
    bg = lerpColor(cNight, cLate, map(h, 21, 24, 0, 1));
  } else if (h >= 0 && h < 6) {
    bg = lerpColor(cLate, cMorning, map(h, 0, 6, 0, 1));
  }

  background(bg);
}

// ----------------------
// body
// ----------------------
function drawFaceandBody() {
  fill(192, 22, 59);
  noStroke();
  ellipse(181.710, 458.3067, 306.7913, 362.8072);
  rect(278, 400, 330, 247);
}

// ----------------------
// belly (minute)
// ----------------------
function drawBelly() {
  let m = minute();
  let bw = 340; // belly max width
  let bh = 299; // belly max height
  let bellySizeh = 0;

  // minute
  if (m < 30) {
    bellySizeh = map(m, 0, 30, 0, bh);
  } else {
    bellySizeh = map(m, 30, 60, bh, 0);
  }

  fill(192, 22, 59);
  noStroke();
  ellipse(479, 403, bw, bellySizeh);
}

// ----------------------
// eyes (hour + second)
// ----------------------
function drawEyes() {
  let h = hour();
  let s = second();

  if (h !== prevHour) {
    if (h > 6 && h <= 12) {
      eyesrw += (45 - 17) / 6;
      eyesrh = 17;
    } else if (h > 12 && h <= 19) {
      eyesrw -= (45 - 17) / 7;
      eyesrh = 17;
    } else if (h > 19 && h <= 24) {
      eyesrw = 17;
      eyesrh += (45 - 17) / 5;
    } else if (h >= 0 && h <= 6) {
      eyesrh -= (45 - 17) / 6;
      eyesrw = 17;
    } else {
      eyesrw = 17;
      eyesrh = 45;
    }
    prevHour = h;
  }

  let blinkrw = eyesrw;
  let blinkrh = eyesrh;

  // 2초마다 한 번 깜빡
  if (s % 2 === 0) {
    blinkrw = eyesrw * 0.2;
    blinkrh = eyesrh * 0.2;
  }

  fill(0);
  rect(116, 331, blinkrw, blinkrh);
  rect(116, 383, blinkrw, blinkrh);
}

// ----------------------
// mouth (basic)
// ----------------------
function drawMouth() {
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(160, 332, 53, 60, 30);
}
