import styled, { css } from 'styled-components'

export default styled.div`
	padding: 4rem;
	border-radius: 1rem;
	background: var(--color-popover-background);
	overflow-x: auto;

	${props =>
		props.transparent &&
		css`
			padding: 0;
			background: none;
		`}
`
