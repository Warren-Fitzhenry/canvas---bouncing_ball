const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
// Set display size (css pixels).
var size = 250;
canvas.style.width = size + "px";
canvas.style.height = size + "px";

// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
canvas.width = size * scale;
canvas.height = size * scale;

// Normalize coordinate system to use css pixels.
c.scale(scale, scale);

const rect = canvas.getBoundingClientRect();
const radius = 16;
const gravity = 0.1;
const dampening = 0.995;
const mousePullStrength = 0.005;
const verticalBorder = rect.height - 2;
const sideBorder = rect.width - 2;

let animate = false;

const mouse = {
  x: 0,
  y: 0,
  down: false,
};

const circle = {
  // Position of circle centre
  x: rect.width / 2,
  y: rect.height / 2,
  // velocity of ball
  vx: 0,
  vy: 0,
};

function incrementSimulation() {
  // Pull the circle toward the mouse
  if (mouse.down) {
    // calculate distance between circle centre and cursor down
    const dx = mouse.x - circle.x;
    const dy = mouse.y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unitX = dx / distance;
    const unitY = dy / distance;
    // force is greater the further the mouse is
    const force = distance * mousePullStrength;
    circle.vx += unitX * force;
    circle.vy += unitY * force;
  }

  // Execute gravity (push down)
  circle.vy += gravity;

  // Execute dampening (slowing down)
  circle.vx *= dampening;
  circle.vy *= dampening;

  // Increment the position by the velocity
  circle.x += circle.vx;
  circle.y += circle.vy;

  if (circle.y + radius > verticalBorder) {
    // Bounce off the floor
    circle.y = verticalBorder - radius;
    circle.vy = -Math.abs(circle.vy);
  } else if (circle.y - radius < 0) {
    // Bounce off the ceiling
    circle.y = radius;
    circle.vy = Math.abs(circle.vy);
  }
  if (circle.x + radius > sideBorder) {
    // Bounce off the right wall
    circle.x = sideBorder - radius;
    circle.vx = -Math.abs(circle.vx);
  } else if (circle.x - radius < 0) {
    // Bounce off the left wall
    circle.x = radius;
    circle.vx = Math.abs(circle.vx);
  }
}

function drawCircle() {
  c.beginPath();
  c.arc(circle.x, circle.y, radius, 0, 2 * Math.PI, false);
  c.fillStyle = "#45b6fe";
  c.fill();
  c.closePath();
}

function drawLineToMouse() {
  c.beginPath();
  c.moveTo(circle.x, circle.y);
  c.lineTo(mouse.x, mouse.y);
  c.strokeStyle = "black";
  c.stroke();
  c.closePath();
}

canvas.addEventListener("mousedown", function (e) {
  mouse.down = true;
  mouse.x = e.pageX - rect.x;
  mouse.y = e.pageY - rect.y;
});

canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX - rect.x;
  mouse.y = e.pageY - rect.y;
});

canvas.addEventListener("mouseup", function (e) {
  mouse.down = false;
});

// Start animating when the mouse enters the canvas
canvas.addEventListener("mouseover", function (e) {
  animate = true;
  drawFrame();
});

// Stop animating when the mouse exits the canvas
canvas.addEventListener("mouseout", function (e) {
  mouse.down = false;
  animate = false;
});

function drawFrame() {
  // Apply gravity and forces
  incrementSimulation();
  c.clearRect(0, 0, canvas.width, canvas.height);
  // Draw items on the chart
  if (mouse.down) {
    drawLineToMouse();
  }
  drawCircle();
  // Only animate if mouse is over the canvas
  if (animate) {
    requestAnimationFrame(drawFrame);
  }
}
// Draw the initial scene once, so something
// is displayed before animation starts.
drawFrame();
