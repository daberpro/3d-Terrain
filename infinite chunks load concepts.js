const world = {
    width: 180,
    height: 180,
};
const maxViewDst = 100;
const chunk_size = 50;
const grid = [];
let a = null,
    b = null;
function setup() {
    createCanvas(600, 600);
    b = new obj(mouseX, mouseY, 100, "rgba(0,0,0,0)", "rgba(0,0,0,0)");

    for (let x = 0; x < Math.round(world.width / chunk_size) - 1; x++) {
        for (let y = 0; y < Math.round(world.height / chunk_size) - 1; y++) {
            grid.push(
                new obj(
                    (x + 1 / 2) * chunk_size,
                    (y + 1 / 2) * chunk_size,
                    chunk_size,
                    "red",
                    "rgba(0,0,0,0)"
                )
            );
            chunks.set(`${x}:${y}`, grid[grid.length - 1]);
        }
    }
}

class obj {
    constructor(x, y, r, c, bd) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.c = c;
        this.bd = bd;
    }

    draw() {
        stroke(this.bd);
        fill(this.c);
        circle(this.x, this.y, this.r);
        rect(this.x - this.r / 2, this.y - this.r / 2, this.r, this.r)
    }

    update(x, y, c, b) {
        this.x = x;
        this.y = y;
        this.c = c || this.c;
        if (b) {
            const jarak = Math.sqrt((b.x - this.x) ** 2 + (b.y - this.y) ** 2);
            this.jarak = jarak;
            if (jarak < this.r / 2 + b.r / 2) {
                this.c = "green";
            } else {
                this.c = "rgba(0,0,0,0)";
            }
        }
    }
}

const chunks = new Map();

function draw() {
    background(220);

    for (let o of grid) {
        o.draw();
        o.update(o.x, o.y, o.c, b);

        if (Math.min(...grid.map((d) => d.jarak)) === o.jarak) {
            o.c = "blue";
            const gap = chunk_size / 2;
            const xinverse = Math.round(o.x / chunk_size - 1 / 2);
            const yinverse = Math.round(o.y / chunk_size - 1 / 2);

            if (!chunks.has(`${xinverse - 1}:${yinverse - 1}`)) {
                grid.push(
                    new obj(
                        (xinverse - 1 + 1 / 2) * chunk_size,
                        (yinverse - 1 + 1 / 2) * chunk_size,
                        chunk_size,
                        "red",
                        "rgba(0,0,0,0)"
                    )
                );
                chunks.set(`${xinverse - 1}:${yinverse - 1}`, grid[grid.length - 1])
            }

            if (!chunks.has(`${xinverse}:${yinverse - 1}`)) {
                grid.push(
                    new obj(
                        (xinverse + 1 / 2) * chunk_size,
                        (yinverse - 1 + 1 / 2) * chunk_size,
                        chunk_size,
                        "red",
                        "rgba(0,0,0,0)"
                    )
                );
                chunks.set(`${xinverse}:${yinverse - 1}`, grid[grid.length - 1])
            }

            if (!chunks.has(`${xinverse + 1}:${yinverse - 1}`)) {
                grid.push(
                    new obj(
                        (xinverse + 1 + 1 / 2) * chunk_size,
                        (yinverse - 1 + 1 / 2) * chunk_size,
                        chunk_size,
                        "red",
                        "rgba(0,0,0,0)"
                    )
                );
                chunks.set(`${xinverse + 1}:${yinverse - 1}`, grid[grid.length - 1])
            }

            if (!chunks.has(`${xinverse + 1}:${yinverse}`)) {
                grid.push(
                    new obj(
                        (xinverse + 1 + 1 / 2) * chunk_size,
                        (yinverse + 1 / 2) * chunk_size,
                        chunk_size,
                        "red",
                        "rgba(0,0,0,0)"
                    )
                );
                chunks.set(`${xinverse + 1}:${yinverse}`, grid[grid.length - 1])
            }

            if (!chunks.has(`${xinverse + 1}:${yinverse + 1}`)) {
                grid.push(
                    new obj(
                        (xinverse + 1 + 1 / 2) * chunk_size,
                        (yinverse + 1 + 1 / 2) * chunk_size,
                        chunk_size,
                        "red",
                        "rgba(0,0,0,0)"
                    )
                );
                chunks.set(`${xinverse + 1}:${yinverse + 1}`, grid[grid.length - 1])
            }

            if (!chunks.has(`${xinverse}:${yinverse + 1}`)) {
                grid.push(
                    new obj(
                        (xinverse + 1 / 2) * chunk_size,
                        (yinverse + 1 + 1 / 2) * chunk_size,
                        chunk_size,
                        "red",
                        "rgba(0,0,0,0)"
                    )
                );
                chunks.set(`${xinverse}:${yinverse + 1}`, grid[grid.length - 1])
            }

            if (!chunks.has(`${xinverse - 1}:${yinverse + 1}`)) {
                grid.push(
                    new obj(
                        (xinverse - 1 + 1 / 2) * chunk_size,
                        (yinverse + 1 + 1 / 2) * chunk_size,
                        chunk_size,
                        "red",
                        "rgba(0,0,0,0)"
                    )
                );
                chunks.set(`${xinverse - 1}:${yinverse + 1}`, grid[grid.length - 1])
            }

            if (!chunks.has(`${xinverse - 1}:${yinverse}`)) {
                grid.push(
                    new obj(
                        (xinverse - 1 + 1 / 2) * chunk_size,
                        (yinverse + 1 / 2) * chunk_size,
                        chunk_size,
                        "red",
                        "rgba(0,0,0,0)"
                    )
                );
                chunks.set(`${xinverse - 1}:${yinverse}`, grid[grid.length - 1])
            }

            fill("black");
            text(
                `${Math.round(o.x / chunk_size - 1 / 2)}:${Math.round(
                    o.y / chunk_size - 1 / 2
                )}`,
                mouseX,
                mouseY
            );
        }
    }

    b.draw();
    b.update(mouseX, mouseY);
}
