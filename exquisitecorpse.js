function setup() {

  let canvas = createCanvas(400, 600);
  canvas.parent("sketch");

  background(255);
  
  drawHead(200, 150);   // head
  drawBody(200, 280);   // body
  drawLegs(200, 400);   // legs
}

function drawHead(x, y) {
  // hair
  strokeWeight(2);
  line(x - 10, y - 50, x - 10, y - 70);
  line(x,       y - 50, x,       y - 75);
  line(x + 10, y - 50, x + 10, y - 70);
  
  // face
  fill(255, 220, 180);
  stroke(0);
  strokeWeight(2);
  ellipse(x, y, 100, 100); 
  
  // ears
  fill(255, 220, 180);
  ellipse(x + 50, y, 20, 30);
  
  // eyes
  fill(0);
  ellipse(x - 15, y - 10, 5, 8);
  ellipse(x + 15, y - 10, 5, 8);
  
  // mouth
  noFill();
  stroke(0);
  arc(x, y + 15, 30, 20, 0, PI / 2);
}

function drawBody(x, y) {
  fill(100, 160, 220);
  noStroke();
  rectMode(CENTER);
  rect(x, y, 120, 160);

  // shoulder
  ellipse(x - 70, y - 60, 100, 80);
  ellipse(x + 70, y - 60, 100, 80);

  // arms
  ellipse(x - 90, y + 20, 60, 120); 
  ellipse(x + 90, y + 20, 60, 120);

  // fists
  ellipse(x - 90, y + 80, 80, 50); 
  ellipse(x + 90, y + 80, 80, 50);

  // orange
  fill(240, 130, 40);
  quad(x - 60, y - 60, x - 40, y - 60, x - 50, y + 80, x - 70, y + 80);
  quad(x + 40, y - 60, x + 60, y - 60, x + 70, y + 80, x + 50, y + 80);

  // muscle
  fill(255);
  rect(x - 20, y - 20, 25, 10);
  rect(x + 20, y - 20, 25, 10);
  rect(x - 20, y + 10, 25, 10);
  rect(x + 20, y + 10, 25, 10);
  rect(x - 20, y + 40, 25, 10);
  rect(x + 20, y + 40, 25, 10);
}

function drawLegs(x, y) {
  noStroke();

  // ice
  fill(192, 249, 242);
  ellipse(x, y + 80, 200, 60);
  
  fill(20, 40, 60);
  
  // legs
  ellipse(x - 40, y, 60, 120);
  ellipse(x + 40, y, 60, 120);
  ellipse(x, y - 40, 100, 60);
  
  // feet
  ellipse(x - 40, y + 60, 90, 40);
  ellipse(x + 40, y + 60, 90, 40);
  
  // tail
  noFill();
  stroke(20, 40, 60);
  strokeWeight(12);
  beginShape();
  curveVertex(x + 20, y);
  curveVertex(x + 20, y);
  curveVertex(x + 100, y + 50);
  curveVertex(x + 60, y + 120);
  curveVertex(x + 20, y + 130);
  endShape();
}
