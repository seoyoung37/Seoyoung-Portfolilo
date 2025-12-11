let numRings = 14;
let pointsPerRing = 30;
let ringGap = 20;
let maxLength = 20;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("sketch");

  colorMode(HSB, 255);
  noCursor();
}

function draw() {
  background(220, 20, 255);

  let cx = width / 2;
  let cy = height / 2;

  for (let r = 1; r <= numRings; r++) {
    let radius = r * ringGap;

    for (let i = 0; i < pointsPerRing; i++) {
      let angle = TWO_PI * i / pointsPerRing;
      let x = cx + cos(angle) * radius;
      let y = cy + sin(angle) * radius;

      let dx = mouseX - x;
      let dy = mouseY - y;
      let distToMouse = dist(mouseX, mouseY, x, y);

      if (distToMouse === 0) {
        distToMouse = 0.0001;
      }

      let len;
      if (distToMouse < 100) {
        len = maxLength;  
      } else if (distToMouse < 300) {
        len = maxLength / 2; 
      } else {
        len = 3; 
      }

      let brightness;
      if (distToMouse < 150) {
        brightness = 255;
      } else if (distToMouse < 300) {
        brightness = 200;
      } else {
        brightness = 150;
      }

      let circleSize = 5 + r * 0.7;

      let baseHue = 150;

      noStroke();
      fill(baseHue, 180, brightness);
      ellipse(x, y, circleSize);


      stroke(baseHue, 180, brightness);
      strokeWeight(20);

      let endX = x + (dx / distToMouse) * len;
      let endY = y + (dy / distToMouse) * len;
      line(x, y, endX, endY);
    }
  }
}
