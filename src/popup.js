const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentColor = '#000';
const themes = [
  {
    background: '#ffeef8',
    color: '#d50077',
    canvasBackground: '#fce4ec',
    canvasBorder: '#f8bbd0',
    noteAreaBackground: '#f8bbd0',
    noteAreaColor: '#d50077',
    buttonBackground: '#d50077',
    buttonHover: '#c51162'
  },
  {
    background: '#e3f2fd',
    color: '#01579b',
    canvasBackground: '#bbdefb',
    canvasBorder: '#90caf9',
    noteAreaBackground: '#90caf9',
    noteAreaColor: '#01579b',
    buttonBackground: '#01579b',
    buttonHover: '#003c8f'
  },
  {
    background: '#fff3e0',
    color: '#e65100',
    canvasBackground: '#ffe0b2',
    canvasBorder: '#ffb74d',
    noteAreaBackground: '#ffb74d',
    noteAreaColor: '#e65100',
    buttonBackground: '#e65100',
    buttonHover: '#bf360c'
  }
];
let currentThemeIndex = 0;

// Add event listeners for mouse actions
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Add event listeners for button actions
document.getElementById('clearBtn').addEventListener('click', clearCanvas);
document.getElementById('downloadBtn').addEventListener('click', downloadCanvasAsImage);
document.getElementById('themeBtn').addEventListener('click', toggleTheme);

// Add event listeners for color options
const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(option => {
  option.addEventListener('click', () => {
    currentColor = option.getAttribute('data-color');
    colorOptions.forEach(opt => opt.style.border = '2px solid #fff');
    option.style.border = '2px solid #000';
  });
});

function startDrawing(e) {
  drawing = true;
  draw(e);
}

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeStyle = currentColor;

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('noteArea').value = '';
}

function downloadCanvasAsImage() {
  const noteText = document.getElementById('noteArea').value;

  // Create a temporary canvas to combine the drawing and background
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');

  // Draw the background color
  const theme = themes[currentThemeIndex];
  tempCtx.fillStyle = theme.canvasBackground;
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw the existing drawing from the original canvas
  tempCtx.drawImage(canvas, 0, 0);

  // Draw the note text
  tempCtx.font = '12px Arial';
  tempCtx.fillStyle = 'black';
  tempCtx.textAlign = 'left';
  const lines = noteText.split('\n');
  lines.forEach((line, index) => {
    tempCtx.fillText(line, 10, tempCanvas.height - (lines.length - index) * 14 - 10);
  });

  // Convert the temporary canvas to a data URL
  const url = tempCanvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'drawing_with_note.png';
  a.click();

  // Clear the original canvas
  clearCanvas();
}

function toggleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  applyTheme(themes[currentThemeIndex]);
}

function applyTheme(theme) {
  // Update body background color and text color
  document.body.style.backgroundColor = theme.background;
  document.body.style.color = theme.color;

  // Update canvas styles
  canvas.style.backgroundColor = theme.canvasBackground;
  canvas.style.borderColor = theme.canvasBorder;

  // Update note area styles
  const noteArea = document.getElementById('noteArea');
  noteArea.style.backgroundColor = theme.noteAreaBackground;
  noteArea.style.color = theme.noteAreaColor;
  noteArea.style.borderColor = theme.noteAreaBackground;

  // Update button styles
  const buttons = document.querySelectorAll('#buttons button');
  buttons.forEach(button => {
    button.style.backgroundColor = theme.buttonBackground;
    button.style.color = '#fff'; // Ensure text is visible
    button.onmouseover = () => {
      button.style.backgroundColor = theme.buttonHover;
    };
    button.onmouseout = () => {
      button.style.backgroundColor = theme.buttonBackground;
    };
  });

  // Update color picker styles
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.style.border = `2px solid ${theme.color}`;
  });
}
