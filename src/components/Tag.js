import { Tag as AntdTag } from 'antd'
import styled from 'styled-components'

const Tag = styled(({ checkable, ...props }) =>
	checkable ? <AntdTag.CheckableTag {...props} /> : <AntdTag {...props} />
)`
	font-size: var(--font-size-normal);
	padding: 6.4px var(--btn-padding-horizontal-lg);
	height: 40px;
	line-height: 1.4em;
	font-size: 1.6rem;
	border: 1px solid var(--color-border-base, black);

	&:not(.ant-tag-checkable-checked):hover {
		color: var(--text-color);
	}

	&.ant-tag-checkable-checked {
		color: var(--text-color);
	}

	& + & {
		margin-left: 1.2em;
	}
`

Tag.CheckableTag = props => <Tag {...props} checkable />

export default Tag
