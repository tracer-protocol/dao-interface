import ApfelGrotezk from 'assets/fonts/ApfelGrotezk-Regular.otf'
import { createGlobalStyle } from 'styled-components'

export const Fonts = createGlobalStyle`
	@font-face {
		font-family: 'ApfelGrotezk';
		font-style: normal;
		font-weight: 400;
		font-display: auto;
		src: url(${ApfelGrotezk}) format('truetype');
	}

	* {
		font-family: 'ApfelGrotezk', sans-serif;
		font-weight: 400;
		line-height: 1.4em;
	}
`

export const Base = createGlobalStyle`
	* {
		box-sizing: border-box;
		-webkit-font-smoothing: antialiased;
	}

	html,
	body {
		padding: 0;
		margin: 0;
		scroll-behavior: smooth;
		height: 100%;
	}

	strong {
		font-weight: 600;
	}

	a {
		text-decoration: none;
		transition: all 150ms;
	}

	hr {
		opacity: 0.15;
		height: 0;
		border: none;
		border-bottom: 1px solid currentColor;
	}

	*:focus {
		outline: none;
	}
`

export const Layout = createGlobalStyle`
	#root {
		position: relative;
		height: 100%;

		.notification-container {
			z-index: 9998;
			top: 7rem;
		}
	}
`

export const Theme = createGlobalStyle`
	html {
		font-size: 10px;
	}

	body {
		font-size: var(--font-size-normal);
	}

	p {
		font-size: var(--font-size-normal);
	}

	.button {
		svg:last-child {
			transition: transform 120ms;
		}
		&:not([disabled]):hover {
			svg:last-child {
				transform: translatex(0.12em);
			}
		}
	}

	.paper > svg {
		width: auto;
		height: auto;
	}
`
