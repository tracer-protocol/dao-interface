import { Typography } from 'antd'
import DataLoader from 'components/DataLoader'
import Filter from 'components/Filter'
import { useMembers } from 'libs/tracer'
import React, { useMemo, useState } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import styled, { css } from 'styled-components'

import Teaser from './Teaser'

const sortMethods = [
	{ key: 'tokensStaked', title: 'Tokens Staked' },
	{ key: 'votesCast', title: 'Votes Cast' },
]

export default styled(({ className }) => {
	const { members, loading } = useMembers()

	const [sortMethod, setSortMethod] = useState(sortMethods[0])

	const sortedMembers = useMemo(() => {
		if ((members || []).length < 1) return members

		if (sortMethod.key === 'tokensStaked') return members.slice().sort((m1, m2) => m2.staked - m1.staked)
		if (sortMethod.key === 'votesCast') return members.slice().sort((m1, m2) => m2.votes.length - m1.votes.length)

		return members
	}, [members, sortMethod])

	return (
		<div className={className}>
			<DataLoader loading={loading} noresults={members?.length <= 0}>
				<div className="topbar">
					<DesktopTitle>Sort by</DesktopTitle>
					<Filter
						title="Sort by"
						options={sortMethods.map(({ key, title }) => ({ key, value: title }))}
						defaultSelected={sortMethod.key}
						onChange={selectedKeys => setSortMethod(sortMethods.find(({ key }) => key === selectedKeys[0]))}
					/>
				</div>
				<VirtuosoGrid
					totalCount={sortedMembers?.length}
					itemContent={index => <Teaser {...sortedMembers[index]} />}
					components={{ List: Results }}
					useWindowScroll
				/>
			</DataLoader>
		</div>
	)
})`
	.topbar {
		margin-bottom: 4.7rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	@media screen and (max-width: 960px) {
		.topbar {
			margin-bottom: 1.5rem;
		}
	}
`

const DesktopTitle = styled(props => <Typography.Title level={4} {...props} />)`
	@media screen and (max-width: 960px) {
		display: none;
	}
`

const Results = styled.div`
	display: grid;
	grid-template: auto / auto;
	grid-column-gap: 2rem;

	${props =>
		props.children.length > 0 &&
		css`
			grid-template: auto / 1fr 1fr;
		`}

	@media screen and (max-width: 960px) {
		grid-template: auto / auto;
	}
`
