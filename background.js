(() => {
    let canvas, ctx, width, height, timer = 0;
    let lines = [];

    function resize() {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class GridLine {
        constructor(x, y, speed, angle) {
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.angle = angle;
        }

        draw() {
            if (!ctx) return;
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
            this.angle = Math.PI / 4;
        }
    }

    function animate() {
        if (!ctx) return;
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

        lines.forEach(line => {
            line.update();
            line.draw();
        });

        timer++;
        requestAnimationFrame(animate);
    }

    document.addEventListener('DOMContentLoaded', () => {
        canvas = document.getElementById('bg-canvas');
        if (canvas) {
            ctx = canvas.getContext('2d');
            window.addEventListener('resize', resize);
            resize();

            for (let i = 0; i < 20; i++) {
                const line = new GridLine(0, 0, 0, 0);
                line.reset();
                lines.push(line);
            }

            animate();
        }
    });
})();
