// 7-day data of my walking
let steps = [5973, 6318, 10130, 5980, 6032, 7237, 8823];
let dist  = [2.4, 2.8, 4.5, 2.6, 2.7, 2.8, 3.7]; // walking+running distance
let flights = [10, 7, 9, 3, 6, 12, 9];           // flights climbed
let stepLen = [28.15, 25.35, 27.55, 25, 24.2, 25.2, 24.4]; // step length
let speed   = [2.6, 2.8, 3.0, 3.1, 2.7, 2.9, 2.4];         // walking speed
let dst     = [28.5, 28.0, 27.8, 27.4, 28.6, 28.2, 30.0];  // double support time

// positions for 7 days
let positions = [
  [100, 100], [300, 100], [500, 100],
  [200, 300], [400, 300],
  [200, 500], [400, 500]
];

function setup() {
  // 🔥 캔버스를 만들고 Project6.html 안의 <div id="sketch">에 붙이기
  let canvas = createCanvas(600, 600);
  canvas.parent("sketch");

  angleMode(DEGREES);
  noStroke();
  textAlign(CENTER);
  textSize(10);
}

function draw() {
  background(0);

  for (let i = 0; i < 7; i++) {
    let x = positions[i][0];
    let y = positions[i][1];

    drawFootOrbit(x, y, i);

    fill(255);
    text("DAY " + (i + 1), x, y + 80);
  }
}

function drawFootOrbit(cx, cy, day) {
  push();
  translate(cx, cy);
  
  let orbitR   = map(dist[day], 2.4, 4.5, 20, 60);
  let coreSize = map(steps[day], 5900, 10130, 10, 30);
  let gap      = map(stepLen[day], 24, 28, 5, 15);
  let rotSpeed = map(speed[day], 2.4, 3.1, 0.3, 1.0);
  let fade     = map(dst[day], 27, 30, 200, 100);
  let flightDots = flights[day];

  // core
  fill(255, 180);
  ellipse(0, 0, coreSize);

  // rotating angle
  let a = frameCount * rotSpeed + day * 40;

  // left / right foot
  let xL = orbitR * cos(a);
  let yL = orbitR * sin(a);
  let xR = orbitR * cos(a + 15);
  let yR = orbitR * sin(a + 15);

  fill(255, fade);
  drawFoot(xL - gap / 2, yL, a);
  drawFoot(xR + gap / 2, yR, a + 180);

  // flights around orbit
  for (let j = 0; j < flightDots; j++) {
    let ang = (j / flightDots) * 360 + frameCount * 1.2;
    let fx = orbitR * cos(ang);
    let fy = orbitR * sin(ang);
    fill(255, 120);
    ellipse(fx, fy, 3);
  }

  pop();
}

function drawFoot(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  ellipse(0, 0, 10, 18);
  fill(255, 150);
  ellipse(0, -5, 6, 8);
  pop();
}
