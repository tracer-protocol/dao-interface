import { createGlobalStyle } from 'styled-components'

import ApfelGrotezk from '@assets//fonts/ApfelGrotezk-Regular.otf'

//fonts
export const Fonts = createGlobalStyle` 
	@font-face {
		font-family: 'ApfelGrotezk';
		font-style: normal;
		font-weight: 400;
		font-display: auto;
		src: url(${ApfelGrotezk}) format('truetype');
	}

	*{
		font-family: 'ApfelGrotezk', sans-serif;
		font-weight: 400;
		line-height: 1.4em;
	}
`

// vars
export const Vars = createGlobalStyle`  
	:root {
		// primary
		--color-primary: #0000BD;

		// greys
		--color-light: #FFFFFF;
		--color-grey-25: #F8F8F8;
		--color-grey-50: #F1F1F1;
		--color-grey-100: #e1e1e1;
		--color-grey-200: #c8c8c8;
		--color-grey-300: #acacac;
		--color-grey-400: #919191;
		--color-grey-500: #6e6e6e;
		--color-grey-600: #404040;
		--color-grey-700: #303030;
		--color-grey-800: #292929;
		--color-grey-900: #212121;
		--color-grey-950: #141414;
		--color-dark: #000000;

		// others
		--color-gold: #ead017;

		// status hex
		--color-status-success: #2ED47A;
		--color-status-concern: #FFB800;
		--color-status-failure: #FF4D00;
		--color-status-neutral: #17B1DC;

		// fonts
		--font-size-xxxlarge: 5rem;
		--font-size-xxlarge: 3.6rem;
		--font-size-xlarge: 2.8rem;
		--font-size-large: 2.1rem;
		--font-size-medium: 1.6rem;
		--font-size-normal: 1.4rem;
		--font-size-small: 12px;
		--font-size-xsmall: 10px;
		--font-size-xxsmall: 9px;
	}
`

// base/reset 
export const Base = createGlobalStyle`  
	*{
		box-sizing: border-box;
		-webkit-font-smoothing: antialiased;
		color: inherit;
	}

	html,body {
		padding: 0;
		margin: 0;
		scroll-behavior: smooth;
	}

	strong{
		font-weight: 600
	}

	a{
		text-decoration: none;
		transition: all 0.15s
	}
	
	hr{
		opacity: 0.15;
		height: 0;
		border: none;
		border-bottom: 1px solid currentColor;
	}

	*:focus{
		outline: none;
	}
`

// layout
export const Layout = createGlobalStyle`  
	#root{
		position: relative;
		min-height: 100vh; 
	
		.notification-container{
			z-index: 9998;
			top: 7rem;
		}
	}
`

// theme
export const Theme = createGlobalStyle`  
	:root{
		
	}

	html{
		font-size: 10px;
	}

	body{
		color: var(--color-dark);
		background: white;
		font-size: var(--font-size-normal);
	}
	
	p{
		font-size: var(--font-size-normal)
	}
	
	.button{
		svg:last-child{ transition: transform 0.12s }
		&:not([disabled]):hover{
			svg:last-child{ transform: translatex(0.12em)}
		}
	}

	.paper > svg {
		width: auto;
		height: auto;
	}
`