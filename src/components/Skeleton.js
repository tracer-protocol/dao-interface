import React from 'react';
import styled, { keyframes } from 'styled-components'

const FadeInAnimation = keyframes`  
	0% { opacity: 0.5 }
	50% { opacity: 1 }
	100% { opacity: 0.5 }
`; 

const DummyText = styled(
	({
		lines=1,
		title,
		className
	}) => {
		return <span className={className}>
			{[...Array(lines)].map((x, i) => <span key={i}/>)}
		</span>
	})`
		>span{
			background: rgba(0,0,0,.05);
			height: 1em;
			animation: ${FadeInAnimation} 2s ease infinite;
			display: block;
			width: 100%;

			& + &{
				margin-top: 1em;
			}

			&:first-child{
				${({title}) => title && `width: 70%;`}
			}
		}

		>span + span{
			margin-top: 0.4em;
		}
	`

export default styled(
	({
		children,
		...rest		
	}) => !!children ? children : <DummyText {...rest}/>
	)
	`
		

	`