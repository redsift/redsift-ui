import checkWebPFeature from './webp';

class FeatureDetection {
  webp(feature, cb) {
    checkWebPFeature(feature, cb);
  }
}

export { FeatureDetection };
