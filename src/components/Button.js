import React from 'react';
import styled from 'styled-components'
import { Button } from 'antd'

export default styled(
	({
		children,
		...props
	}) =>
		<Button {...props}>{children}</Button>
	)
	`
		background: var(--color-light);
		border: none;
		color: var(--color-primary);
		border-radius: 1.4em;
		padding: 4px 18px;
		color: var(--color-primary);
		
		&:hover{
			color: var(--color-primary);
		}

		&.ant-btn-lg {
			padding: 6.4px 30px;
		}

		&.ant-btn-primary{
			background: var(--color-primary);
			color: var(--color-light);
		}

		${({onClick}) => onClick && `cursor: pointer;`}
	`
