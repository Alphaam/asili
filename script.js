let questions = [
  "What color represents community to you?",
  "What color do you associate with tradition?",
  "What color reflects your view of innovation?",
  "What color embodies your sense of belonging?",
  "What color symbolizes your idea of governance?"
];

let pimples = []; // Store deformities on the sphere
let currentQuestion = 0;

function setup() {
  // Create the 3D canvas
  let canvas = createCanvas(800, 800, WEBGL);
  canvas.parent('canvas-container');

  // Initialize the question interface
  initQuestions();
}

function draw() {
  background(30);

  // Rotate the sphere for a dynamic effect
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);

  // Apply hue-changing gradient to the sphere
  let gradient = createGradient(frameCount * 0.01);
  texture(gradient);

  // Draw the base sphere
  sphere(200);

  // Add pimples (deformities) to the sphere
  pimples.forEach(pimple => {
    push();
    fill(pimple.color);
    let theta = radians(pimple.angleX);
    let phi = radians(pimple.angleY);
    let x = (200 + pimple.size) * sin(theta) * cos(phi);
    let y = (200 + pimple.size) * sin(theta) * sin(phi);
    let z = (200 + pimple.size) * cos(theta);
    translate(x, y, z);
    sphere(pimple.size); // Draw the pimple
    pop();
  });
}

function createGradient(offset) {
  let gradient = createGraphics(400, 400);
  for (let y = 0; y < gradient.height; y++) {
    let t = map(y, 0, gradient.height, 0, 1);
    let c1 = color(255 * sin(offset), 255 * cos(offset), 255);
    let c2 = color(255, 255 * sin(offset + PI / 2), 255 * cos(offset + PI / 2));
    let c = lerpColor(c1, c2, t);
    gradient.stroke(c);
    gradient.line(0, y, gradient.width, y);
  }
  return gradient;
}

function initQuestions() {
  let questionText = document.getElementById('question-text');
  let colorPickers = document.getElementById('color-pickers');

  questionText.innerText = questions[currentQuestion];

  // Add a color picker
  let colorPickerContainer = document.createElement('div');
  colorPickerContainer.classList.add('color-picker');

  let colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.addEventListener('input', (event) => {
    handleColorSelection(event.target.value);
  });

  colorPickerContainer.appendChild(colorPicker);
  colorPickers.innerHTML = ''; // Clear previous color picker
  colorPickers.appendChild(colorPickerContainer);
}

function handleColorSelection(color) {
  // Convert color to p5.js format
  let selectedColor = colorStringToP5Color(color);

  // Add a pimple to the sphere
  pimples.push({
    color: selectedColor,
    size: random(20, 50), // Bigger pimples
    angleX: random(0, 360), // Random angular position
    angleY: random(0, 360) // Random angular position
  });

  // Move to the next question or end if all are answered
  currentQuestion++;
  if (currentQuestion < questions.length) {
    initQuestions();
  } else {
    document.getElementById('question-text').innerText = "All questions answered!";
    document.getElementById('color-pickers').innerHTML = '';
  }
}

function colorStringToP5Color(hexColor) {
  let c = unhex(hexColor.slice(1).match(/.{1,2}/g));
  return color(c[0], c[1], c[2]);
}
