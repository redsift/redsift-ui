function _dummyData(range, segments) {
  var color = d3.scale.category20(); // FIXXME: use segments!

  var r = Redsift.Lang.localShortMonths();
  r = r.concat(Redsift.Lang.localShortMonths(), Redsift.Lang.localShortMonths());
  return r.map(function(m, i) {
    var v = Math.random() * range;
    return {
      name: m,
      value: v,
      color: function() {
        return color(v)
      },
      classed: (i !== 1) ? undefined : 'stripe'
    };
  }).filter(function(d, i) {
    return i < 12;
  });
}

window.addEventListener('WebComponentsReady', function(e) {
  var chart = document.querySelector('rs-radial-chart');

  if (chart) {
    var segments = ["#edf8b1", "#7fcdbb", "#2c7fb8"];

    // Setup radial chart via public API
    chart.segments = segments;
    chart.data = _dummyData(200, segments);
  }
});
