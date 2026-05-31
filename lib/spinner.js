var spin = require('spinnies');

var spinner = {
    "interval": 100,
    "frames": [
        "",
        "scanning message",
        "scanning message",
        "scanning message",
        "scanning message",
        "scanning message",
        "scanning message",
        "scanning message",
        "scanning message",
        "scanning message",
        "scanning message",
        ""
    ]
};

let globalSpinner;

var getGlobalSpinner = (disableSpins = false) => {
    if (!globalSpinner) globalSpinner = new spin({ color: 'white', succeedColor: 'blue', spinner, disableSpins });
    return globalSpinner;
};

let spins = getGlobalSpinner(false);

module.exports.start = (id, text) => {
    try { spins.add(id, { text: text }); } catch(e) {}
};

module.exports.stop = (id, text) => {
    try { spins.remove(id); } catch(e) {}
};
