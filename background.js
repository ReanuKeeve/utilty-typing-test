const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let timer = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class GridLine {
    constructor(x, y, speed, angle) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.angle = angle;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const lg = ctx.createLinearGradient(
            this.x, this.y, 
            this.x + Math.cos(this.angle) * 100, 
            this.y + Math.sin(this.angle) * 100
        );
        lg.addColorStop(0, 'rgba(255, 23, 68, 0.3)');
        lg.addColorStop(1, 'transparent');
        ctx.strokeStyle = lg;
        ctx.lineTo(this.x + Math.cos(this.angle) * 100, this.y + Math.sin(this.angle) * 100);
        ctx.stroke();
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = 1 + Math.random() * 2;
        this.angle = Math.PI / 4; // 45 degrees for a retro aesthetic
    }
}

const lines = [];
for (let i = 0; i < 20; i++) {
    const line = new GridLine(0, 0, 0, 0);
    line.reset();
    lines.push(line);
}

function animate() {
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.05)';
    ctx.lineWidth = 1;

    const gridSize = 50;
    const offset = (timer * 2) % gridSize;

    // Vertical lines
    for (let x = offset; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Horizontal lines
    for (let y = offset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Floating lines
    lines.forEach(line => {
        line.update();
        line.draw();
    });

    timer++;
    requestAnimationFrame(animate);
}

animate();
