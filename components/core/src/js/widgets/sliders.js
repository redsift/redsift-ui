let style = document.createElement("style");
document.head.appendChild(style);
let sheet = style.sheet;

function updateRange(input, index) {
    let min = input.min || 0;
    let max = input.max || 100;

    let v = Math.ceil(((input.value - min) / (max - min)) * 100);
    try {
        sheet.deleteRule(index);
    } catch (e) {}
    sheet.addRule('input[type=range].rs-index-' + index + '::-webkit-slider-runnable-track', 'background-size:' + v + '% 100%', index);
}

let Sliders = {
    initAllRanges() {
        let r = document.querySelectorAll('input[type=range]');
        for (let i = 0; i < r.length; i++) {
            let input = r[i];

            input.className += " rs-index-" + i;
            updateRange(input, i);
            (function(idx) {
                input.addEventListener('input', function() {
                    updateRange(this, idx);
                });
            })(i);
        }
    },

    setValue(control, value) {
        control.value = value;
        let r = document.querySelectorAll('input[type=range]');
        for (let i = 0; i < r.length; i++) {
            if (r[i] === control) {
                updateRange(control, i);
            }
        }
    }
};

export { Sliders };
