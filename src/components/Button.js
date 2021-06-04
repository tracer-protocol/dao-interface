import { Button } from 'antd'
import styled, { css } from 'styled-components'

export default styled(Button)`
	${props =>
		(props.type === undefined || props.type === 'default') &&
		css`
			&&&:hover {
				color: white;
				background: var(--color-primary);
				border-color: var(--color-primary);
			}
		`}
	${props =>
		props.type === 'inverse' &&
		css`
			&&& {
				border: none;
				background: var(--color-inverse);
				color: var(--text-color-inverse);
			}

			&&&:hover {
				background: var(--color-inverse-muted);
			}
			&&&:active {
				background: var(--color-inverse);
			}
		`}
`
