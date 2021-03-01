import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { Tag } from '@components'

export default styled(
	({
		exclusive = true,
		options = [],
		defaultSelected = [],
		onChange = () => {},
		className
	}) => {

		const [tags, setTags] = useState(options.map(option => ({...option, checked: defaultSelected.includes(option.key) ? true : false})))

		const handleChange = (key, checked) => {
			setTags(tags.map(tag => {
				if(key){
					if(exclusive === true) tag.checked = tag.key === key
					else if(tag.key === key) tag.checked = checked 
				}
				return tag
			}))

			broadcastState()
		}

		const broadcastState = () => {
			const active = tags.map(tag => tag.checked === true ? tag.key : null).filter(t=>t)
			onChange(active)
		}

		// broadcast state on mount
		useEffect(broadcastState, []) // eslint-disable-line

		return <div className={`filter ${className}`}>
			{tags.map(({key, value, icon, checked}) => 
				<Tag.CheckableTag
					key={key}
					checked={checked}
					onChange={checked => handleChange(key, checked)}
					>
					<span className="icon">{icon}</span> {value}
				</Tag.CheckableTag>
			)}
		</div>
	})
	`

		.ant-badge-status-text{
			display: none;
		}

		.ant-badge-status-dot{
			margin-right: 0.2em;
			opacity: 0.5;
		}

		.ant-tag-checkable-checked{
			.ant-badge{
				.ant-badge-status-dot{
					opacity: 1;
				}
			}
		}
		

	`