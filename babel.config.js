module.exports = {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: [
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    '@_assets': './src/assets',
                    '@_components': './src/components',
                    '@_constants': './src/constants',
                    '@_hooks': './src/hooks',
                    '@_navigation': './src/navigation',
                    '@_screens': './src/screens',
                    '@_types': './src/types',
                    '@_utils': './src/utils',
                },
            },
        ],
        'react-native-worklets/plugin',
    ],
};
