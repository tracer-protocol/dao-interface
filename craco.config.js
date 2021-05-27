const path = require('path')

// Creates a new craco plugin from a bare overrideWebpackConfig function
//
// Documentation for the overrideWebpackConfig function arguments is available at:
// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#overridewebpackconfig
//
const createWebpackOverridePlugin = overrideWebpackConfig => ({ plugin: { overrideWebpackConfig } })

// Allows imports to refer to the `src` directory as though its contents were their own node modules
//
// Before:
// import MyComponent from '../../components/MyComponent'
//
// After:
// import MyComponent from 'components/MyComponent'
//
const AbsoluteImportsPlugin = createWebpackOverridePlugin(({ webpackConfig }) => {
	webpackConfig.resolve.modules.push('src')
	return webpackConfig
})

// Provides a number of @<ident> import aliases to the contents of the `src` directory
//
// Before:
// import MyComponent from '../../components/MyComponent'
//
// After:
// import MyComponent from '@components/MyComponent'
//
const ImportAliasesPlugin = createWebpackOverridePlugin(({ webpackConfig }) => {
	webpackConfig.resolve.alias = {
		...webpackConfig.resolve.alias,
		'@root': path.resolve(__dirname, 'src/'),
		'@archetypes': path.resolve(__dirname, 'src/archetypes/'),
		'@assets': path.resolve(__dirname, 'src/assets/'),
		'@components': path.resolve(__dirname, 'src/components/'),
		'@libs': path.resolve(__dirname, 'src/libs/'),
		'@routes': path.resolve(__dirname, 'src/routes/'),
		'@util': path.resolve(__dirname, 'src/util/'),
	}
	return webpackConfig
})

const CracoLessPlugin = {
	plugin: require('craco-less'),
	options: {
		lessLoaderOptions: {
			lessOptions: {
				modifyVars: {
					hack: `true;@import "${require.resolve('./src/App.Style.less')}";`,
				},
				javascriptEnabled: true,
			},
		},
	},
}

const CircularDependencyPlugin = createWebpackOverridePlugin(({ webpackConfig }) => {
	webpackConfig.plugins.push(
		new (require('circular-dependency-plugin'))({
			exclude: /node_modules/,
			allowAsyncCycles: false,
		})
	)
	return webpackConfig
})

module.exports = {
	babel: {
		plugins: ['babel-plugin-styled-components'],
	},
	plugins: [AbsoluteImportsPlugin, ImportAliasesPlugin, CracoLessPlugin, CircularDependencyPlugin],
}
