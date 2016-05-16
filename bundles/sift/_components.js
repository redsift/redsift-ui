// Note: registering custom elements by default:
import { registerHeroElement } from '../../components/hero/index';

registerHeroElement();

export { html as svg } from '@redsift/d3-rs-svg';
export * from '@redsift/d3-rs-core';

export {
    registerHeroElement,
    RedsiftHero
} from '../../components/hero/index.js';
