import { fromWei, numberToMaxDb, truncateString } from 'util/helpers'

import { Skeleton, Statistic } from 'antd'
import { useProposals } from 'libs/tracer'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import styled from 'styled-components'

export default styled(({ id, staked, votes = [], className }) => {
	const { proposals } = useProposals({ creator: id })

	return (
		<div className={`proposal-teaser ${className}`}>
			{id ? (
				<Jazzicon diameter={40} seed={id && jsNumberForAddress(id)} />
			) : (
				<Skeleton.Avatar className="paper" active size="large" loading={!id} />
			)}
			<Statistic className="title" title="Staker" loading={!id} value={truncateString(id)} />
			<Statistic className="staked" title="Tokens Staked" value={numberToMaxDb(fromWei(staked), 5)} />
			<Statistic className="raised" title="Proposals Raised" value={proposals.length} />
			<Statistic className="cast" title="Votes Cast" value={votes.length} />
		</div>
	)
})`
	display: grid;
	grid-template: auto / auto auto 1fr auto auto auto;
	grid-template-areas: 'avatar title . staked raised cast';
	grid-gap: 2rem;
	align-items: center;
	margin-top: 2rem;
	padding: 2rem;
	border-radius: 1rem;
	background: var(--color-popover-background);
	box-shadow: 0 0 rgba(0, 0, 0, 0.1);

	> .paper {
		grid-area: avatar;
	}

	> .title {
		grid-area: title;
	}
	> .staked {
		grid-area: staked;
	}
	> .raised {
		grid-area: raised;
	}
	> .cast {
		grid-area: cast;
	}

	.ant-statistic {
		.ant-statistic-content,
		.ant-skeleton-content {
			font-size: 1.6rem;
		}
		.ant-skeleton-title {
			font-size: 1.6rem;
			margin: 0;
			height: 1.3em;
		}
	}

	@media screen and (max-width: 960px) {
		grid-template: auto auto / auto auto auto 1fr;
		grid-template-areas:
			'title title title avatar'
			'staked raised cast .';

		> .paper {
			justify-self: end;
			align-self: start;
		}
	}
`
