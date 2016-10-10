class Scene {

    constructor(w, h) {
        this.canvas = document.createElement("canvas");
        this.canvas.style.border = "1px solid black"
        this.canvas.style.display = "block"
        this.canvas.width = w;
        this.canvas.height = h;
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.context.font = "12px sans-serif";
        this.context.scale(1,-1);
        this.context.translate(0, -h);
    }

    clear(color) {
        this.context.fillStyle = color||'white';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    transpose(event) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: this.canvas.height - (event.clientY - rect.top)
        }
    }

    // camera
    lock(target) {
        this.x = Math.max(target.x-this.canvas.width/2, 0);
        this.y = Math.max(target.y-this.canvas.height/2, 0);
        scene.context.translate(-this.x, -this.y);
    }

    unlock() {
        scene.context.translate(this.x, this.y);
    }
}

class Box {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    setSpeed(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    move(dt) {
        this.x += this.vx*dt;
        this.y += this.vy*dt;
    }

    fill(color) {
        scene.context.fillStyle = color;
        scene.context.fillRect(this.x, this.y, this.w, this.h);
    }

    stroke(color) {
        scene.context.strokeStyle = color;
        scene.context.strokeRect(this.x, this.y, this.w, this.h);
    }

    label(color, string) {
        scene.context.save();
        scene.context.translate(0, scene.canvas.height);
        scene.context.scale(1, -1);
        scene.context.fillStyle = color;
        scene.context.fillText(string, this.x, scene.canvas.height-this.y-this.h);
        scene.context.restore();
    }

    deflect(normal) {
        if (Math.abs(normal.x) > 0) {
            this.vx = -this.vx;
        }
        if (Math.abs(normal.y) > 0) {
            this.vy = -this.vy;
        }
    }

    slide(normal) {
        var dotprod = (this.vx * normal.y + this.vy * normal.x);
        this.vx = dotprod * normal.y;
        this.vy = dotprod * normal.x;
    }

    nextCollision(entities) {
        var nearest = (c1, c2) => c1.time > c2.time ? c2 : c1;
        return entities.map(sweptAABB, this).reduce(nearest);
    }

}

function sweptAABB(b2) {
    var b1 = this;
    var collision = {time: 1, normal: {x: 0, y: 0}, target: null};
    var x, X, y, Y;

    if (b1.vx > 0) {
        x = b2.x - (b1.x + b1.w);
        X = (b2.x + b2.w) - b1.x;
    } else {
        x = (b2.x + b2.w) - b1.x;
        X = b2.x - (b1.x + b1.w);
    }

    if (b1.vy > 0) {
        y = b2.y - (b1.y + b1.h);
        Y = (b2.y + b2.h) - b1.y;
    } else {
        y = (b2.y + b2.h) - b1.y;
        Y = b2.y - (b1.y + b1.h);
    }

    var broadPhase = (x > 0 === X >= 0) && (b1.vx === 0)
                  || (y > 0 === Y >= 0) && (b1.vy === 0);

    // TODO: 0/0 === NaN, 1/0 === Infinity
    var tx = b1.vx===0 ? -Infinity : x / b1.vx;
    var tX = b1.vx===0 ?  Infinity : X / b1.vx;

    var ty = b1.vy===0 ? -Infinity : y / b1.vy;
    var tY = b1.vy===0 ?  Infinity : Y / b1.vy;

    var t1 = Math.max(tx, ty);
    var t2 = Math.min(tX, tY);

    if ( t1 > t2 || tx < 0 && ty < 0 || tx > 1 || ty > 1 || broadPhase) {
        // no collision
    } else if (tx > ty) {
        // horizontal collision
        collision.normal.x = x < 0 ? 1 : -1;
        collision.normal.y = 0;
        collision.time = t1;
        collision.target = b2;
    } else {
        // vertical collision
        collision.normal.x = 0;
        collision.normal.y = y < 0 ? 1 : -1;
        collision.time = t1;
        collision.target = b2;
    }
    return collision;
}

class Platformer extends Box {

    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.pressed = new Set();
        window.onkeyup = e => this.pressed.delete(e.keyCode);
        window.onkeydown = e => this.pressed.add(e.keyCode);
        this.airLeft = 0;
    }

    resolve(entities) {
        var vx = 0;
        var vy = (this.vy||0) - 1;
        var airUsed = Math.max(Math.min(this.airLeft, 2), 0);
        if (this.pressed.has(37)) { vx -= 3; }
        if (this.pressed.has(39)) { vx += 3; }
        if (this.pressed.has(38)) { vy += this.airLeft; }
        this.airLeft -= airUsed;
        this.setSpeed(vx, Math.max(-10, vy));

        var collision = this.nextCollision(entities);
        if (collision && collision.target) {
            // if hit the ground
            if (collision.normal.y === -1 && this.vy < 0) {
                this.airLeft = 7;
                this.vy = 0;
            }
            this.move(collision.time);
            this.slide(collision.normal);
            // hit another wall after sliding
            var anotherCollision = this.nextCollision(entities);
            this.move(Math.min(1-collision.time, anotherCollision.time));
        } else {
            this.move(1);
        }
    }
}


