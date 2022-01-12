
# **Instalar o react-native-svg-transformer**
`yarn add -D react-native-svg-transformer`

# **Depois editar o metro.config.js**
## apenas copie e cole os valores abaixo (Caso vá usar essa lib só copie Se vc usa EXPO SDK v41.0 ou superior para quem usa React Native apenas o codigo é diferente- Consultar o github da lib)


`const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return config;
})();`


