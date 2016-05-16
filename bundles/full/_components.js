// Note: registering custom elements by default:
import { registerHeroElement } from '../../components/hero/index';
import { registerRadialChartElement } from '../../components/radial-chart/index';
import { registerScheduleElement } from '../../components/schedule/index';

registerHeroElement();
registerRadialChartElement();
registerScheduleElement();

export { html as svg } from '@redsift/d3-rs-svg';
export * from '@redsift/d3-rs-core';

export {
    registerHeroElement,
    RedsiftHero
} from '../../components/hero/index.js';

export {
    registerRadialChartElement,
    RedsiftRadialChart
} from '../../components/radial-chart/index.js';

export {
    registerScheduleElement,
    RedsiftSchedule
} from '../../components/schedule/index.js';
