import { D3 as RedsiftD3 } from '@redsift/d3-rs-core';

class RedsiftSchedule {
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

export default RedsiftSchedule;
