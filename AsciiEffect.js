import { Cell } from "./Cell.js";

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
        this.#drawImageScaled(image, this.#ctx);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    };

    #drawImageScaled(img, ctx) {
        var canvas = ctx.canvas;
        var hRatio = window.innerWidth / img.width;
        var vRatio = window.innerHeight / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (window.innerWidth - img.width * ratio) / 2;
        var centerShift_y = (window.innerHeight - img.height * ratio) / 2;
        this.#ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.#ctx.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }

    #convertToSymbol(color) {
        const symbols = ["@", "*", "+", "#", "&", "%", "_", ":", "$", "/", "-", "X", "W"];
        const thresholds = [250];
        for (let i = symbols.length - 1; i > 0; i--) {
            thresholds.push((250 / symbols.length) * i)
        };
        for (let i = 0; i < thresholds.length; i++) {
            if (color >= thresholds[i]) {
                return symbols[i];
            }
        }
    };
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
                    const symbol = this.#convertToSymbol(averageColorvalue);
                    if (total > 200) {
                        this.#imageCellArray.push(new Cell(x, y, symbol, color));
                    }
                }
            }
        }
    }
    #drawAscii() {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        this.#imageCellArray.forEach(imageCell => {
            imageCell.draw(this.#ctx)
        });

    }
    draw(cellSize) {
        if (cellSize == 1) {
            this.#drawImageScaled(this.#image, this.#ctx);
            return;
        }
        this.#scanImage(cellSize)
        this.#drawAscii()
    }
}