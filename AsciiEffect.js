import { Cell } from "./Cell";

export class AsciiEffect {
    #imageCellArray = [];
    #symbols = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    #image;

    constructor(ctx, width, height, image) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#image = image;
        this.#ctx.drawImage(image, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }

    #converToSymbol(color) {
        const symbols = ["@", "*", "+", "#", "&", "%", "_", ":", "$", "/", "-", "X", "W"];
        const thresholds = [250];
        for (let i = symbols.length - 1; i > 0; i--) {
            thresholds.push((250 / symbols.length) * i)
        }
        thresholds.forEach(threshold => {
            if (color < threshold) {
                return symbols[thresholds.indexOf(threshold)];
            }
        })
    }
    #scanImage = function (cellSize) {
        this.#imageCellArray = [];
        for (let y = 0; y < this.#pixels.height; y += cellSize) {
            for (let x = 0; x < this.#pixels.width; x += cellSize) {
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY * this.#pixels.width) + posX;

                if (this.#pixels.data[pos + 3] > 128) {
                    const red = this.#pixels.data[pos]
                    const green = this.#pixels.data[pos + 1]
                    const blue = this.#pixels.data[pos + 2]
                    const total = (red + green + blue);
                    const averageColorvalue = total / 3;
                    const color = "rgb(" + red + "," + green + "," + blue + ")";
                    const symbol = this.#converToSymbol(averageColorvalue);
                    if (total > 200) {
                        this.#imageCellArray.push(new Cell(x, y, symbol, color));
                    }
                }
            }
        }
    }
    draw(cellSize) {
        this.#scanImage(cellSize)
    }
}