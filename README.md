# Verus PBaaS Visualizer

The login consent client tool is a React/Webpack UI meant to be used together with Verus-Desktop to visualize entire PBaaS networks using graphs.

## Testing

To test, run ```yarn install``` followed by ```yarn start```. If you'd like to test alongside Verus-Desktop, run the Verus-Desktop-GUI webpack bundler with ```yarn start-no-dashboard``` instead of ```yarn start```, so dashboards do not conflict.

## Building 

To compile to a build folder for production, run ```yarn build```. To bundle with Verus-Desktop, put the contents of that build folder into ```Verus-Desktop/assets/plugins/builtin/verus-pbaas-visualizer/```.
