function setup() {
    let canvas = createCanvas(400, 400);
    canvas.parent("sketch"); 
  }
  
  function draw() {
    background(255);
  
    drawface();
    draweyes();
    drawmouth();
  
    if (mouseIsPressed) {
      drawnose();
    }
  }
  
  function drawface() {
    let R = 255 * mouseX / 400;
    let G = 255 * mouseY / 400;
    let B = 0;
  
    if (mouseIsPressed) {
      B = random(255);
    }
  
    fill(R, G, B);
    noStroke();
  
    let facewidth = mouseX;
    let faceheight = mouseY;
  
    if (facewidth > 400) {
      facewidth = 400;
    }
  
    if (faceheight > 400) {
      faceheight = 400;
    }
  
    ellipse(200, 200, facewidth, faceheight);
  }
  
  function draweyes() {
    let eyesX = abs(200 - mouseX) / 2;
    let eyesY = abs(200 - mouseY) / 2;
  
    stroke('rgb(255,255,255)');
    strokeWeight(3);
    line(220, 205, 220 + eyesX, 200 - eyesY);
    line(180, 205, 180 - eyesX, 200 - eyesY);
  }
  
  function drawmouth() {
    stroke(255);
    noFill();
    rect(200 - mouseX / 5, 220, (mouseX / 5) * 2, mouseY / 5, mouseX / 10);
  }
  
  function drawnose() {
    fill(255, 255, 255);
    noStroke();
    ellipse(200, 220, mouseX / 10, mouseY / 10);
  }
  