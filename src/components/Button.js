import { Button } from 'antd'
import styled, { css } from 'styled-components'

export default styled(Button)`
	${props =>
		props.type === 'inverse' &&
		css`
			&&& {
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
