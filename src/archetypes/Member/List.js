import React from 'react';
import styled from 'styled-components'
import { DataLoader } from '@components'
import { useMembers } from '@libs/tracer'
import Teaser from './Teaser'

export default styled(
	({
		className
	}) => {
		const { members, loading } = useMembers()

		return <div 
			className={className}
			>
			<DataLoader
				loading={loading}
				noresults={members?.length <= 0}
				>
				{members.map(member => <Teaser key={member.id} {...member}/>)}
			</DataLoader>
		
		</div>
	})
	`	
		.topbar{
			margin-bottom: 4.7rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.proposal-teaser + .proposal-teaser{
			margin-top: 1em
		}
	`