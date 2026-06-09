// script.js - Lirios realistas con tallo, efecto 3D y corazones blancos

let flowers = [];
let hearts = [];
let bg = '#0C2C40';
let lyrics = [
  "data/Song 1.txt",
  "data/Song 2.txt",
  "data/Song 3.txt"
];
let fileCount = 0;
let lines;

function preload() {
    lines = loadStrings(lyrics[fileCount % lyrics.length]);
}

// Clase Flower con pétalos curvos y efecto 3D
class Flower {
    constructor(_s, _cx, _cy) {
        this.s = _s;
        this.cx = _cx;
        this.cy = _cy;
        this.size = 0;
        this.targetSize = random(60, 100);
        this.bloomSpeed = random(0.3, 0.7);
        this.opacity = 255;
        this.fadeSpeed = random(0.5, 1.2);

        this.petalCount = 6; // lirios suelen tener 6 pétalos
        this.angleStep = TWO_PI / this.petalCount;

        this.stemHeight = this.targetSize * 1.5;
        this.stemColor = color(50, 180, 50);

        this.petalColors = [];
        for (let i = 0; i < this.petalCount; i++) {
            // Gradiente simulando volumen
            this.petalColors.push({
                inner: color(random(230, 255), random(180, 220), random(200, 255), 180),
                outer: color(random(180, 210), random(150, 190), random(200, 230), 100)
            });
        }
    }

    drawStem() {
        push();
        stroke(this.stemColor);
        strokeWeight(4);
        line(this.cx, this.cy, this.cx, this.cy + this.stemHeight);
        pop();
    }

    drawPetal(angle, colors) {
        push();
        translate(this.cx, this.cy);
        rotate(angle);
        for (let s = 0; s < this.size; s += 2) {
            let interCol = lerpColor(colors.inner, colors.outer, s / this.size);
            let lightFactor = map(cos(frameCount*0.02 + s*0.1), -1, 1, 0.7, 1);
            let c = color(
                red(interCol) * lightFactor,
                green(interCol) * lightFactor,
                blue(interCol) * lightFactor,
                this.opacity
            );
            fill(c);
            noStroke();
            beginShape();
            vertex(0,0);
            bezierVertex(s*0.2, -s*1.5, s*0.8, -s*1.8, 0, -s*2.2);
            bezierVertex(-s*0.8, -s*1.8, -s*0.2, -s*1.5, 0,0);
            endShape(CLOSE);
        }
        pop();
    }

    drawCenter() {
        push();
        translate(this.cx, this.cy);
        noStroke();
        fill(255, 220, 0, this.opacity);
        ellipse(0, 0, this.size/5, this.size/5);
        pop();
    }

    display() {
        this.drawStem();
        for (let i = 0; i < this.petalCount; i++) {
            let angle = i*this.angleStep + sin(frameCount*0.02 + i)*0.1;
            this.drawPetal(angle, this.petalColors[i]);
        }
        this.drawCenter();
    }

    update() {
        if (this.size < this.targetSize) this.size += this.bloomSpeed;
        else this.opacity -= this.fadeSpeed;
        this.display();
    }

    isFaded() {
        return this.opacity <= 0;
    }
}

// Clase Heart con corazones blancos
class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(20, 50);
        this.col = color(255, 255, 255); // blanco
        this.opacity = 255;
        this.fadeSpeed = random(0.9, 1.8);
    }

    display() {
        push();
        translate(this.x, this.y);
        fill(red(this.col), green(this.col), blue(this.col), this.opacity);
        noStroke();
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.1) {
            const r = this.size / 16;
            const x = r * 16 * pow(sin(a), 3);
            const y = -r * (13*cos(a) - 5*cos(2*a) - 2*cos(3*a) - cos(4*a));
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

    update() {
        this.opacity -= this.fadeSpeed;
        this.display();
    }

    isFaded() { return this.opacity <= 0; }
}

function setup() {
    let container = select('#flower-container');
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(container);
    background(bg);
}

function draw() {
    background(bg);

    for (let i = flowers.length-1; i>=0; i--) {
        flowers[i].update();
        if (flowers[i].isFaded()) flowers.splice(i,1);
    }

    for (let i = hearts.length-1; i>=0; i--) {
        hearts[i].update();
        if (hearts[i].isFaded()) hearts.splice(i,1);
    }

    if(frameCount % 20 === 0) addFlower();
    if(frameCount % 30 === 0) addHeart();
}

function addFlower() {
    let x = random(width);
    let y = random(height);
    flowers.push(new Flower(lines[fileCount % lines.length], x, y));
}

function addHeart() {
    let x = random(width);
    let y = random(height);
    hearts.push(new Heart(x, y));
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function keyReleased() {
    if(key == 'n') {
        fileCount++;
        preload();
        setup();
    }
}