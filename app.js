// Canvas setup
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20;

// State management
let currentTool = null;
let currentColor = '#000000';
let isDrawing = false;
let startX, startY;
let history = [];
let historyStep = -1;
let drawnShapes = []; // Track all drawn shapes for code generation

// Tool buttons
const toolButtons = {
    lineTool: document.getElementById('lineTool'),
    rectTool: document.getElementById('rectTool'),
    circleTool: document.getElementById('circleTool'),
    hexagonTool: document.getElementById('hexagonTool'),
    octagonTool: document.getElementById('octagonTool'),
    triangleTool: document.getElementById('triangleTool'),
    eraserTool: document.getElementById('eraserTool'),
    bucketFill: document.getElementById('bucketFill'),
};

// Action buttons
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearBtn = document.getElementById('clearCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const downloadCodeBtn = document.getElementById('downloadCodeBtn');
const colorPicker = document.getElementById('colorPicker');
const pythonOutput = document.getElementById('pythonOutput');

// Status elements
const toolStatus = document.getElementById('toolStatus');
const colorStatus = document.getElementById('colorStatus');

// Draw grid background
function drawGrid() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    for (let i = 0; i <= canvas.height; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

// Create rulers
function createRulers() {
    const topRuler = document.getElementById('topRuler');
    const sideRuler = document.getElementById('sideRuler');

    // Top ruler
    topRuler.innerHTML = '';
    for (let i = 0; i < 600; i += GRID_SIZE) {
        const mark = document.createElement('div');
        mark.className = 'top-ruler-mark';
        mark.textContent = i > 0 ? i : '';
        topRuler.appendChild(mark);
    }

    // Side ruler
    sideRuler.innerHTML = '';
    for (let i = 0; i < 600; i += GRID_SIZE) {
        const mark = document.createElement('div');
        mark.className = 'side-ruler-mark';
        mark.textContent = i > 0 ? i : '';
        mark.style.writingMode = 'horizontal-tb';
        sideRuler.appendChild(mark);
    }
}

// Generate Python code from drawn shapes
function generatePythonCode() {
    let code = `import tkinter as tk
from tkinter import Canvas
import math

# Initialize window
root = tk.Tk()
root.title("Button Shape")
root.geometry("800x800")

# Create canvas
canvas = Canvas(root, width=800, height=800, bg='white')
canvas.pack()

# Draw shapes
`;

    if (drawnShapes.length === 0) {
        code += `# No shapes drawn yet\n`;
    } else {
        drawnShapes.forEach((shape, index) => {
            code += `\n# Shape ${index + 1}: ${shape.type}\n`;
            code += shape.pythonCode;
        });
    }

    code += `
# Display the window
root.mainloop()
`;

    return code;
}

// Convert hex to RGB tuple for Python
function hexToRgbPython(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return `(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
    }
    return '(0, 0, 0)';
}

// Update Python code display
function updatePythonCode() {
    const code = generatePythonCode();
    pythonOutput.textContent = code;
}

// Save canvas state to history
function saveState() {
    historyStep++;
    if (historyStep < history.length) {
        history.length = historyStep;
    }
    history.push(canvas.toDataURL());
    updateHistoryButtons();
    updatePythonCode();
}

// Update undo/redo button states
function updateHistoryButtons() {
    undoBtn.disabled = historyStep <= 0;
    redoBtn.disabled = historyStep >= history.length - 1;
}

// Tool selection
Object.keys(toolButtons).forEach(key => {
    toolButtons[key].addEventListener('click', () => {
        // Remove active class from all buttons
        Object.values(toolButtons).forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        toolButtons[key].classList.add('active');
        
        // Set current tool
        currentTool = key.replace('Tool', '');
        toolStatus.textContent = toolButtons[key].textContent;
    });
});

// Color picker
colorPicker.addEventListener('change', (e) => {
    currentColor = e.target.value;
    colorStatus.textContent = currentColor;
});

// Drawing functions
function drawLine(fromX, fromY, toX, toY, color = currentColor) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Store for code generation
    const pythonCode = `canvas.create_line(${fromX}, ${fromY}, ${toX}, ${toY}, fill='${color}', width=2)\n`;
    return { type: 'Line', pythonCode, color };
}

function drawRectangle(fromX, fromY, toX, toY, color = currentColor) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(fromX, fromY, toX - fromX, toY - fromY);

    const pythonCode = `canvas.create_rectangle(${fromX}, ${fromY}, ${toX}, ${toY}, outline='${color}', width=2)\n`;
    return { type: 'Rectangle', pythonCode, color };
}

function drawCircle(fromX, fromY, toX, toY, color = currentColor) {
    const radius = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(fromX, fromY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    const pythonCode = `canvas.create_oval(${fromX - radius}, ${fromY - radius}, ${fromX + radius}, ${fromY + radius}, outline='${color}', width=2)\n`;
    return { type: 'Circle', pythonCode, color };
}

function drawRegularPolygon(fromX, fromY, toX, toY, sides, color = currentColor) {
    const radius = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let points = [];
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
        const x = fromX + radius * Math.cos(angle);
        const y = fromY + radius * Math.sin(angle);
        points.push([x, y]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Generate Python code for polygon
    const flatPoints = points.flat().join(', ');
    const pythonCode = `canvas.create_polygon(${flatPoints}, outline='${color}', width=2)\n`;
    return { type: `Polygon(${sides}-sided)`, pythonCode, color };
}

function drawTriangle(fromX, fromY, toX, toY, color = currentColor) {
    return drawRegularPolygon(fromX, fromY, toX, toY, 3, color);
}

function drawHexagon(fromX, fromY, toX, toY, color = currentColor) {
    return drawRegularPolygon(fromX, fromY, toX, toY, 6, color);
}

function drawOctagon(fromX, fromY, toX, toY, color = currentColor) {
    return drawRegularPolygon(fromX, fromY, toX, toY, 8, color);
}

function eraseArea(x, y, size = 20) {
    ctx.clearRect(x - size / 2, y - size / 2, size, size);
}

function bucketFill(x, y, color = currentColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const pixelIndex = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
    const targetR = data[pixelIndex];
    const targetG = data[pixelIndex + 1];
    const targetB = data[pixelIndex + 2];
    const targetA = data[pixelIndex + 3];

    const fillColor = hexToRgb(color);

    function flood(pixelIndex) {
        const stack = [pixelIndex];
        while (stack.length > 0) {
            const index = stack.pop();
            if (data[index + 3] === 0) continue;

            if (
                data[index] === targetR &&
                data[index + 1] === targetG &&
                data[index + 2] === targetB &&
                data[index + 3] === targetA
            ) {
                data[index] = fillColor.r;
                data[index + 1] = fillColor.g;
                data[index + 2] = fillColor.b;
                data[index + 3] = 255;

                const pixelPosition = index / 4;
                const row = Math.floor(pixelPosition / canvas.width);
                const col = pixelPosition % canvas.width;

                if (col > 0) stack.push((pixelPosition - 1) * 4);
                if (col < canvas.width - 1) stack.push((pixelPosition + 1) * 4);
                if (row > 0) stack.push((pixelPosition - canvas.width) * 4);
                if (row < canvas.height - 1) stack.push((pixelPosition + canvas.width) * 4);
            }
        }
    }

    flood(pixelIndex);
    ctx.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
}

// Canvas events
canvas.addEventListener('mousedown', (e) => {
    if (!currentTool) return;

    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDrawing = true;

    if (currentTool === 'eraser') {
        eraseArea(startX, startY);
    } else if (currentTool === 'bucketFill') {
        bucketFill(startX, startY);
        saveState();
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing || !currentTool) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'eraser') {
        eraseArea(x, y);
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDrawing || !currentTool) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    // Redraw grid
    drawGrid();

    // Redraw previous history
    if (historyStep >= 0 && history[historyStep]) {
        const img = new Image();
        img.src = history[historyStep];
        img.onload = () => {
            ctx.drawImage(img, 0, 0);

            // Draw the new shape and track it
            let shapeData = null;
            switch (currentTool) {
                case 'line':
                    shapeData = drawLine(startX, startY, endX, endY);
                    break;
                case 'rect':
                    shapeData = drawRectangle(startX, startY, endX, endY);
                    break;
                case 'circle':
                    shapeData = drawCircle(startX, startY, endX, endY);
                    break;
                case 'hexagon':
                    shapeData = drawHexagon(startX, startY, endX, endY);
                    break;
                case 'octagon':
                    shapeData = drawOctagon(startX, startY, endX, endY);
                    break;
                case 'triangle':
                    shapeData = drawTriangle(startX, startY, endX, endY);
                    break;
                case 'eraser':
                    eraseArea(endX, endY);
                    break;
            }

            if (shapeData) {
                drawnShapes.push(shapeData);
            }

            saveState();
        };
    }

    isDrawing = false;
});

// History functions
undoBtn.addEventListener('click', () => {
    if (historyStep > 0) {
        historyStep--;
        drawnShapes.pop(); // Remove last shape
        const img = new Image();
        img.src = history[historyStep];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            ctx.drawImage(img, 0, 0);
            updatePythonCode();
        };
        updateHistoryButtons();
    }
});

redoBtn.addEventListener('click', () => {
    if (historyStep < history.length - 1) {
        historyStep++;
        const img = new Image();
        img.src = history[historyStep];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            ctx.drawImage(img, 0, 0);
        };
        updateHistoryButtons();
    }
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawnShapes = [];
    saveState();
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'button-shape.png';
    link.click();
});

// Copy code button
copyCodeBtn.addEventListener('click', () => {
    const code = pythonOutput.textContent;
    navigator.clipboard.writeText(code).then(() => {
        copyCodeBtn.textContent = 'Copied! ✓';
        setTimeout(() => {
            copyCodeBtn.textContent = 'Copy Code';
        }, 2000);
    });
});

// Download Python code button
downloadCodeBtn.addEventListener('click', () => {
    const code = pythonOutput.textContent;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([code], { type: 'text/plain' }));
    link.download = 'button_shape.py';
    link.click();
});

// Initialize
drawGrid();
createRulers();
saveState();
updateHistoryButtons();
toolStatus.textContent = 'None';
updatePythonCode();
