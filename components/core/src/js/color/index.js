// Start: Adapted from https://github.com/MoOx/color-convert
// MIT : https://github.com/MoOx/color-convert/blob/master/LICENSE
// Copyright (c) 2011 Heather Arthur <fayearthur@gmail.com>

function rgb2xyz(rgb) {
    let r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255;

    // assume sRGB
    r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
    g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
    b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

    let x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
    let y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
    let z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

    return [x * 100, y * 100, z * 100];
}

function rgb2lab(rgb) {
    let xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

    x /= 95.047;
    y /= 100;
    z /= 108.883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

    l = (116 * y) - 16;
    a = 500 * (x - y);
    b = 200 * (y - z);

    return [l, a, b];
}

// End : Adapted from https://github.com/MoOx/color-convert

function hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        console.log('Could not parse color', hex);
        return [0, 0, 0];
    }
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ];
}

const TEXT_WHITE = '#fff';
const TEXT_BLACK = '#000';
const BG_RS = ['#ed154f', '#ED1651', '#C82254', '#A62A57', '#842F59', '#842F59', '#35355C', '#231F20'];
const L_TH = 64;

let ColorTools = {
    randomTheme() {
        return BG_RS[Math.floor(Math.random() * BG_RS.length)];
    },

    textColorFor(c) {
        if (typeof c === 'string' || c instanceof String) {
            c = hexToRgb(c);
        }
        let lab = rgb2lab(c);
        if (lab[0] < L_TH) {
            return TEXT_WHITE;
        }
        return TEXT_BLACK;
    },

    lightnessSort() {
        let lab = colors.map(function(c) {
            let a = c;
            if (!Array.isArray(c)) {
                a = hexToRgb(c);
            }

            return [rgb2lab(a), c];
        });

        let sort = lab.sort(function(a, b) {
            if (a[0][0] < b[0][0]) return -1;
            if (a[0][0] > b[0][0]) return -1;
            return 0;
        });

        return sort.map(function(a) {
            return a[1];
        });
    },

    themes: BG_RS
};

export { ColorTools };
