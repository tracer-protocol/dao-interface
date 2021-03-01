import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { useGlobalLoadingState } from '@libs/graph';

export default styled(
	({
		className
	}) => {
		const loading = useGlobalLoadingState()
		const [state, setState] = useState('WAITING')

		useEffect(() => {
			// if animating and not loading: finish & cleanup
			if(state === 'LOADING' && loading === false){
				setState('COMPLETE')
				setTimeout(() => {
					setState('RESETTING')
					setTimeout(() => {
						setState('WAITING')
					}, 500)
				}, 1000)
			}
			// else if we're not animating, and begin loading: reset & start animating
			else if(state !== 'LOADING' && loading === true){
				setState('WAITING')
				setTimeout(() => setState('LOADING'), 100)
			}

		}, [loading]) // eslint-disable-line

		return <div 
			className={className} 
			data-state={state}
		/>
	})
	`

	height: 5px;
	width: 100%;
	display: block;
	//background: transparent;
	position: relative;

	&:after{
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 5px;
		width: 0;
		background: #1890ff;
		transition: none 0s ease-out;
	}

	&[data-state="RESETTING"]:after{
		width: 100%;
		opacity: 0;
		transition-duration: 0.5s;
		transition-property: opacity
	}

	&[data-state="WAITING"]:after{
		width: 0%;
		opacity: 0;
		transition: none;
	}

	&[data-state="LOADING"]:after{
		width: 99.9%;
		opacity: 0.999;
		transition-duration: 5s;
		transition-property: width
	}
		
	&[data-state="COMPLETE"]:after{
		width: 100%;
		opacity: 1;
		transition-duration: 0.4s;
		transition-property: width
	}

		
	`