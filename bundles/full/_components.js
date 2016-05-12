// Note: registering custom elements by default:
import { registerHeroElement } from '../../components/hero/index';
import { registerRadialChartElement } from '../../components/radial-chart/index';

registerHeroElement();
registerRadialChartElement();

export {
    registerHeroElement,
    RedsiftHero
} from '../../components/hero/index.js';

export {
    registerRadialChartElement,
    RedsiftRadialChart
} from '../../components/radial-chart/index.js';
