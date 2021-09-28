import { Dropdown, Menu, Typography } from 'antd'
import { ReactComponent as TriangleDown } from 'assets/triangle_down.svg'
import Button from 'components/Button'
import FlexSpace from 'components/FlexSpace'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

export default function Filter({
	title = '',
	exclusive = true,
	options = [],
	defaultSelected = [],
	onChange = () => {},
	...props
}) {
	const [tags, setTags] = useState(
		options.map(option => ({ ...option, checked: defaultSelected.includes(option.key) ? true : false }))
	)

	const handleChange = (key, checked) => {
		setTags(
			tags.map(tag => {
				if (key) {
					if (exclusive === true) tag.checked = tag.key === key
					else if (tag.key === key) tag.checked = checked
				}
				return tag
			})
		)

		broadcastState()
	}

	const broadcastState = () => {
		const active = tags.map(tag => (tag.checked === true ? tag.key : null)).filter(t => t)
		onChange(active)
	}

	// broadcast state on mount
	useEffect(broadcastState, []) // eslint-disable-line

	const filterMenu = (
		<DropdownMenu>
			{tags.map(({ key, value, icon, checked }) => (
				<DropdownMenuItem key={key}>
					<DropdownButton size="large" type={'text'} onClick={checked => handleChange(key, checked)}>
						<span className="icon">{icon}</span> {value}
					</DropdownButton>
				</DropdownMenuItem>
			))}
		</DropdownMenu>
	)

	return (
		<>
			<Desktop>
				<StyledFilter {...props}>
					{tags.map(({ key, value, icon, checked }) => (
						<TagButton
							key={key}
							size="large"
							type={checked && 'primary'}
							onClick={checked => handleChange(key, checked)}
						>
							<span className="icon">{icon}</span> {value}
						</TagButton>
					))}
				</StyledFilter>
			</Desktop>
			<Mobile>
				<StyledFilter {...props}>
					<Title>{title}</Title>
					<FlexSpace />
					<Dropdown overlay={filterMenu} placement="bottomRight">
						<DropdownButton size="large" type="text">
							{tags.filter(tag => tag.checked)[0]?.value} <TriangleDown />
						</DropdownButton>
					</Dropdown>
				</StyledFilter>
			</Mobile>
		</>
	)
}

const StyledFilter = styled.div`
	> *:not(:last-child) {
		margin-right: 2rem;
	}

	@media screen and (max-width: 960px) {
		width: 100%;
		display: flex;
		align-items: center;
	}
`

const TagButton = styled(Button)`
	&&&:active {
		background: var(--color-border-base);
	}
`
const DropdownButton = styled(Button)`
	border-radius: 0;
	&& {
		color: var(--color-primary);
	}

	svg {
		margin-left: 1em;
		width: 1em;
		height: 1em;
	}
`
const DropdownMenu = styled(Menu)`
	width: 100%;
	padding: 0;
	border-radius: 0;

	${DropdownButton} {
		width: 100%;
		color: var(--color-light);
		background: var(--color-popover-lighter-background);
	}
`
const DropdownMenuItem = styled(Menu.Item)`
	padding: 0;
`

const Title = styled(props => <Typography.Title level={4} {...props} />)`
	&&& {
		margin: 0;
		padding: 0 var(--btn-padding-horizontal-lg);
	}
`

const Desktop = styled.div`
	display: block;

	@media screen and (max-width: 960px) {
		display: none;
	}
`
const Mobile = styled.div`
	width: 100%;
	display: none;

	@media screen and (max-width: 960px) {
		display: block;
	}
`
