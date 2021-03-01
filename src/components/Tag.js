import React from 'react';
import styled from 'styled-components'
import { Tag as AntdTag } from 'antd'

const Tag = styled(
	({
		checkable,
		children,
		...props
	}) => 
		!!checkable 
			? <AntdTag.CheckableTag {...props}>{children}</AntdTag.CheckableTag> 
			: <AntdTag {...props}>{children}</AntdTag>
	)
	`
		border: none;
		border-radius: 1.2em;
		font-size: 1.4rem;
		padding: 0.55rem 1.5rem;
		border: 1px solid var(--color-primary, black);
		color: var(--color-primary, black);

		&:not(.ant-tag-checkable-checked):hover{
			color: var(--color-primary, black) !important;
		}

		&.ant-tag-checkable-checked{
			background: var(--color-primary, black);
			color: var(--color-primary-inverse, white);
		}

		& + &{
			margin-left: 1.2em;
		}
	`

Tag.CheckableTag = props => <Tag {...props} checkable/> 

export default Tag