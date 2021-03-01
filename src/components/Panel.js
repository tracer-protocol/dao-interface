import React from 'react';
import styled from 'styled-components'

export default styled(
	({
		children, 
		...props
	}) => 
		<div {...props}>{children}</div>
	)
	`
		background: white;
		padding: 4rem 4rem;
		border-radius: 1em;
	`
