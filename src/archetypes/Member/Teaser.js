import { fromWei, numberToMaxDb, truncateString } from 'util/helpers'

import { Statistic, Typography } from 'antd'
import { useProposals } from 'libs/tracer'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'

export default styled(({ id, staked, votes = [], className }) => {
	const { proposals } = useProposals({ creator: id })

	return (
		<div className={`proposal-teaser ${className}`}>
			<Typography.Title level={1} ellipsis className="title">
				<Jazzicon diameter={20} seed={jsNumberForAddress(id)} />
				{truncateString(id)}
			</Typography.Title>
			<Statistic title="Tokens Staked" value={numberToMaxDb(fromWei(staked), 5)} />
			<Statistic title="Proposals Raised" value={proposals.length} />
			<Statistic title="Votes Cast" value={votes.length} />
		</div>
	)
})`
	padding: 1.7rem 2em;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: var(--color-popover-background);

	> * {
		width: 25%;
	}

	.title {
		margin: 0;
		margin-right: 1em;
		font-size: 1.8rem;
		font-weight: normal;
		display: flex;
		align-items: center;

		*:first-child {
			margin-right: 0.5rem !important;
		}
	}

	.ant-statistic {
		.ant-statistic-content {
			font-size: 1.6rem;
		}
	}
`
