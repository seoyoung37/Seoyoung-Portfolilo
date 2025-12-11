const CELL = 33;
const COLS = 12, ROWS = 12;
const MAZE_W = CELL * COLS, MAZE_H = CELL * ROWS;

const MOVE_TIME = 120;
const TOAST_TIME = 1600;
const TAP_TO_HATCH = 10;

const DINO_SCALE = 0.9;
const DINO_ENDING_W = 92, DINO_ENDING_H = 92;

// Maze scene2 color
const C_WALL_DARK  = '#cfcfd4';
const C_WALL_LIGHT = '#e1e2e7';
const C_FLOOR      = '#ffffff';
const C_HUD_GLASS  = 'rgba(255,255,255,0.65)';
const C_HUD_STROKE = 'rgba(255,255,255,0.9)';
const C_COIN_BASE  = '#ffcd62';
const C_COIN_HL    = 'rgba(255,245,200,0.95)';

let dinoImg, dinoImgReady = false;
function preload() {
  dinoImg = loadImage(
    'assets/dino.png',
    () => dinoImgReady = true,
    e => { console.error('Failed to load assets/dino.png', e); dinoImgReady = false; }
  );
}

let scene = 1;
let cracks = 0;
let particles = [];

let dinoX = 1, dinoY = 1;
let tX = 1, tY = 1;
let tween = null, moving = false;

let treasures = 0, steps = 0;
let showMessage = "", toastUntil = 0;
let trail = [];
let confetti = [];
let playAgainBtn;

const exitX = 10, exitY = 9;

const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,1],
  [1,1,1,1,1,0,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,0,0,0,0,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1]
];

const treasuresPos = [{x:2,y:1},{x:7,y:5},{x:5,y:9}];

const messages = [
  "Even when lost, you are still moving forward.",
  "Every small step is shaping who you are.",
  "You’ve found what truly guides you, your own courage."
];

function setup() {
  // 🔥 캔버스를 만들고 Project7.html 안의 <div id="sketch">에 붙이기
  let canvas = createCanvas(600, 400);
  canvas.parent("sketch");

  noSmooth();
  textFont('Helvetica, Arial, sans-serif');
}

function draw() {
  if (scene === 1) drawSceneHatch();
  else if (scene === 2) drawSceneMaze();
  else drawSceneEnding();
}

const ox = () => Math.round((width  - MAZE_W) / 2);
const oy = () => Math.round((height - MAZE_H) / 2);

function gradientBG(top, bottom) {
  for (let y = 0; y < height; y++) {
    stroke(lerpColor(color(top), color(bottom), y/height));
    line(0, y, width, y);
  }
}

function drawDinoAt(x, y, w, h) {
  imageMode(CENTER);
  if (dinoImgReady) image(dinoImg, x, y, w, h);
}

function updateTween() {
  if (!tween) return;
  const k = constrain((millis() - tween.start) / tween.dur, 0, 1);
  const e = (k < 0.5) ? 2*k*k : -1 + (4 - 2*k)*k;
  dinoX = lerp(tween.sx, tween.tx, e);
  dinoY = lerp(tween.sy, tween.ty, e);
  if (k >= 1) { tween = null; moving = false; }
}

// for Scene2
function glassBar(x,y,w,h,r=12){
  noStroke(); 
  fill(C_HUD_GLASS); 
  rect(x,y,w,h,r);
  stroke(C_HUD_STROKE); 
  strokeWeight(1);
  noFill(); 
  rect(x+1.5,y+1.5,w-3,h-3,r-10);
  noStroke(); 
  fill(255,120); 
  rect(x+6,y+4,w-12,10,8);
}

function softTile(x,y,w,h,rad=8){
  drawingContext.shadowOffsetY = 2;
  noStroke(); 
  fill(C_WALL_DARK);
  rect(x, y, w, h, rad);
  fill(C_WALL_LIGHT);
  rect(x+4, y+4, w-8, h-8, rad-2);
}

function coinSparkle(cx, cy, t){
  push(); 
  translate(cx, cy); 
  noStroke();
  const pulse = 1 + 0.08 * sin(t*0.14);
  fill(C_COIN_BASE + '33'); 
  circle(0, 0, 26*pulse);
  fill(C_COIN_BASE); 
  circle(0, 0, 16*pulse);
  fill(C_COIN_HL); 
  ellipse(-3, -3, 6, 6);
  pop();
}

function portalAt(x, y, size, t){
  push(); 
  translate(x,y); 
  noStroke();
  const r = size*0.46;
  for (let i=0;i<6;i++){
    const a = 140 - i*22;
    fill(123,123,230, a);
    circle(0,0, (r + i*5) * (1 + 0.03*sin(t*0.08+i)));
  }
  pop();
}

function showToast(msg) {
  showMessage = msg;
  toastUntil = millis() + TOAST_TIME;
}

// Scene 1 //
function drawSceneHatch() {
  gradientBG('#fcdc74', '#ffeaa6');

  // egg
  noStroke(); 
  fill(255);
  ellipse(width/2, height/2, 120, 160);

  // crack
  const holeR = map(cracks, 0, TAP_TO_HATCH, 0, 15, true);
  fill(255, 207, 51);
  ellipse(width/2, height/2, holeR*8, holeR);

  // crack particle
  particles.forEach(p => {
    p.x += p.vx; 
    p.y += p.vy; 
    p.vy += 0.05; 
    p.a *= 0.96;
    fill(140,120,120, 255*p.a);
    push(); 
    translate(p.x,p.y); 
    rotate(p.r); 
    rect(-3,-2,6,4,1); 
    pop();
  });
  particles = particles.filter(p => p.a > 0.02);

  // progress
  fill(80); 
  textAlign(CENTER, CENTER); 
  textSize(14);
  fill(90); 
  text("Click the egg to crack", width/2, height - 70);

  const prog = constrain(cracks / TAP_TO_HATCH, 0, 1);
  fill(255); 
  rect(width/2 - 80, height - 100, 160, 10, 6);
  fill(255, 196, 94); 
  rect(width/2 - 80, height - 100, 160 * prog, 10, 6);

  // born
  if (cracks === TAP_TO_HATCH) drawDinoAt(width/2, height/2 - 30, 70, 70);

  // scene transition
  if (cracks >= TAP_TO_HATCH) {
    fill(90); 
    textSize(30);
    text("Dino is born!", width/2, height/2 + 90);
    if (!this._go) this._go = millis() + 700;
    else if (millis() > this._go) { 
      this._go = null; 
      scene = 2; 
    }
  }
}

function mousePressed() {
  if (scene === 1) {
    if (dist(mouseX, mouseY, width/2, height/2) < 80) {
      cracks++;
      for (let i = 0; i < 10; i++) particles.push(makeParticle());
    }
  }
  if (scene === 2 && treasures >= 3) {
    const gx = floor((mouseX - ox()) / CELL);
    const gy = floor((mouseY - oy()) / CELL);
    if (gx === exitX && gy === exitY && !moving && dinoX === tX && dinoY === tY) {
      scene = 3; 
      launchConfetti();
    }
  }
}

function makeParticle() {
  return { 
    x: width/2 + random(-6, 6), 
    y: height/2 + random(-10, 5),
    vx: random(-1.5, 1.5), 
    vy: random(-2.5, -0.5),
    r: random(TWO_PI), 
    a: 1 
  };
}

// Scene 2 //
function drawSceneMaze() {
  background('#fffff1');   // 원래 '#fffff14'는 잘못된 hex라 살짝만 수정

  const mx = ox(), my = oy();
  glassBar(mx-10, my-10, MAZE_W+20, MAZE_H+20, 16);

  updateTween();

  // tile
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const X = mx + x*CELL, Y = my + y*CELL;
      if (maze[y][x] === 1) softTile(X, Y, CELL, CELL, 8);
      else { 
        noStroke(); 
        fill(C_FLOOR); 
        rect(X, Y, CELL, CELL, 6); 
      }
    }
  }

  // footsteps
  noStroke();
  for (let i=0;i<trail.length;i++){
    const t = trail[i], a = map(i,0,trail.length-1,40,110);
    fill(120,200,160,a);
    ellipse(mx + t.x*CELL + CELL/2, my + t.y*CELL + CELL/2, 8, 8);
  }

  // treasures
  for (let i=0;i<treasuresPos.length;i++){
    if (treasures > i) continue;
    const p = treasuresPos[i];
    const cx = mx + p.x*CELL + CELL/2;
    const cy = my + p.y*CELL + CELL/2;
    coinSparkle(cx, cy, frameCount + i*15);
  }

  // EXIT
  if (treasures >= treasuresPos.length) {
    const cx = mx + exitX*CELL + CELL/2;
    const cy = my + exitY*CELL + CELL/2;
    noStroke(); 
    fill('#fff'); 
    rect(mx + exitX*CELL, my + exitY*CELL, CELL, CELL, 8);
    portalAt(cx, cy, CELL, frameCount);
    fill(60); 
    textAlign(CENTER,CENTER); 
    textSize(12); 
    text("EXIT", cx, cy);
  }

  // dino
  const px = mx + dinoX*CELL + CELL/2;
  const py = my + dinoY*CELL + CELL/2;
  const idle = (!tween && !moving) ? sin(frameCount*0.08)*1.5 : 0;
  drawDinoAt(px, py - idle, CELL * DINO_SCALE, CELL * DINO_SCALE);

  // HUD bar
  glassBar(8, 8, width-16, 30, 10);

  for (let i = 0; i < treasuresPos.length; i++){
    const x = 20 + i*22, y = 23;
    noStroke(); 
    fill(255,255,255,220); 
    circle(x, y, 12);
    if (i < treasures) {
      fill(C_COIN_BASE); 
      circle(x, y, 10); 
      fill(C_COIN_HL); 
      ellipse(x-2.5, y-2.5, 3.6, 3.6); 
    } else {
      fill(0,35); 
      circle(x, y, 10);
    }
  }

  fill(50); 
  textAlign(LEFT, CENTER); 
  textSize(14); 
  text(`Steps: ${steps}`, 110, 23);

  fill(60); 
  textAlign(RIGHT, CENTER); 
  textSize(14); 
  text("Use Arrow keys to move", width-18, 23);

  // toast
  if (millis() < toastUntil) {
    const a = map(toastUntil - millis(), 0, 300, 0, 255, true);
    fill(20,20,20, a); 
    rect(20, height-46, width-40, 28, 8);
    fill(240, a); 
    textAlign(CENTER, CENTER); 
    textSize(12); 
    text(showMessage, width/2, height-32);
  }
}

function tryMove(dx, dy) {
  if (scene !== 2 || moving || tween) return;

  const nx = round(tX + dx), ny = round(tY + dy);
  if (maze[ny][nx] === 1) return;

  moving = true;
  trail.push({x: tX, y: tY}); 
  if (trail.length > 18) trail.shift();

  tween = { sx: tX, sy: tY, tx: nx, ty: ny, start: millis(), dur: MOVE_TIME };
  tX = nx; 
  tY = ny; 
  steps++;

  const i = treasures;
  if (i < treasuresPos.length) {
    const tp = treasuresPos[i];
    if (nx === tp.x && ny === tp.y) { 
      treasures++; 
      showToast(messages[i]); 
    }
  }

  if (treasures >= treasuresPos.length && nx === exitX && ny === exitY) {
    scene = 3;                                                               
    launchConfetti();
  }
}

function keyPressed() {
  if (scene !== 2) return;
  if (keyCode === UP_ARROW)    tryMove(0, -1);
  if (keyCode === DOWN_ARROW)  tryMove(0,  1);
  if (keyCode === LEFT_ARROW)  tryMove(-1, 0);
  if (keyCode === RIGHT_ARROW) tryMove(1,  0);
}

// Scene 3 //
function drawSceneEnding() {
  gradientBG('#fffaf0', '#f5ebdc');
  drawDinoAt(width/2, height/2 + 10, DINO_ENDING_W*1.2, DINO_ENDING_H*1.2);

  fill(60); 
  textAlign(CENTER, CENTER); 
  textSize(16);
  text("Every path you took has led you here!\n Stronger, Braver, and Wiser!", width/2, 120);

  confetti.forEach(c=>{
    c.y += c.vy; 
    c.x += c.vx; 
    c.vy += 0.03; 
    c.rot += c.rv; 
    c.a *= 0.992;
    push(); 
    translate(c.x,c.y);
    rotate(c.rot);
    fill(red(c.clr), green(c.clr), blue(c.clr), 255*c.a);
    rect(-3,-3,6,6,2); 
    pop();
  });
  confetti = confetti.filter(c=>c.a>0.05);

  // play again //
  if (!playAgainBtn) {
    playAgainBtn = createButton("Play Again");
    playAgainBtn.position(width/2-40, height-120);
    playAgainBtn.mousePressed(resetGame);
    playAgainBtn.style('padding','10px 14px');
    playAgainBtn.style('font-size','14px');
    playAgainBtn.style('border-radius','10px');
    playAgainBtn.style('border','0');
    playAgainBtn.style('background','#12b886');
    playAgainBtn.style('color','#fff');
    playAgainBtn.style('cursor','pointer');
  }
}

// Reset //
function resetGame() {
  if (playAgainBtn) { 
    playAgainBtn.remove(); 
    playAgainBtn = null; 
  }
  scene = 1;
  cracks = 0; 
  particles = [];
  dinoX = tX = 1; 
  dinoY = tY = 1; 
  tween = null; 
  moving = false;
  treasures = 0; 
  showMessage = ""; 
  toastUntil = 0; 
  steps = 0; 
  trail = [];
  confetti = [];
}

function launchConfetti() {
  confetti = [];
  for (let i = 0; i < 120; i++) {
    confetti.push({
      x: random(40, width - 40),
      y: random(-40, 40),
      vx: random(-1.2, 1.2),
      vy: random(0.2, 2.2),
      rv: random(-0.2, 0.2),
      rot: random(TWO_PI),
      clr: color(random(['#ff5e5b', '#ffd166', '#06d6a0', '#118ab2'])),
      a: 1
    });
  }
}
