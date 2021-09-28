import { fromWei } from 'util/helpers'

import { useProposal } from 'libs/tracer'
import styled from 'styled-components'

export default function Votes({ id, ...props }) {
	const { state, votesAgainst: votesAgainstWei, votesFor: votesForWei } = useProposal(id)

	const votesAgainst = parseInt(fromWei(votesAgainstWei), 10)

	// TODO: Fix snapshot proposals (currently we hard code their yes votes to 17)
	const votesForTmpFixed = state === 'complete' && fromWei(votesForWei) === '0' ? '17' : fromWei(votesForWei)
	const votesFor = parseInt(votesForTmpFixed, 10)

	const votesTotal = votesFor + votesAgainst

	const yesPercent = votesTotal === 0 ? 50 : (votesFor / votesTotal) * 100 || 0

	return (
		<StyledVotes {...props}>
			<YesProgress percent={yesPercent}>
				<strong>Yes</strong> | {votesFor} Votes
			</YesProgress>
			<NoProgress>
				{votesAgainst} Votes | <strong>No</strong>
			</NoProgress>
		</StyledVotes>
	)
}

const StyledVotes = styled.div`
	position: relative;
	border-radius: 999999999rem;
	background: var(--color-component-background);
	overflow: hidden;
`
const YesProgress = styled.div`
	width: ${props => `${props.percent}%`};
	padding: 1rem 1rem 1rem 3rem;
	border-radius: 999999999rem;
	color: var(--color-light);
	background: var(--color-primary);
`
const NoProgress = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	width: 100%;
	padding: 1rem 3rem 1rem 1rem;
	border-radius: 999999999rem;
	text-align: right;
	color: var(--color-light);
`
