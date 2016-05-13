import { D3 as RedsiftD3 } from '../../../core/src/js/d3/index';

class RedsiftRadialChart {
  constructor(el) {
    this.$el = el;
  }

  update(data, width) {
    this.chart = RedsiftD3.Reusable.scheduleChart()
                        .eventHeight(40)
                        .eventPadding(2)
                        .rasterize(d3.select(this.$el), data, width, 0, 2);
  }
}

export default RedsiftRadialChart;
