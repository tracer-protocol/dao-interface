import { truncateString } from 'util/helpers'

import { StarFilled } from '@ant-design/icons'
import { Typography } from 'antd'
import { Button, Statistic } from 'antd'
import Skeleton from 'components/Skeleton'
import { useProposal, useProposals } from 'libs/tracer'
import { useAccount } from 'libs/web3'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import useProposalStatus from './useProposalStatus'
import ProposalVotes from './Votes'

export default styled(({ id, className }) => {
	const proposal = useProposal(id)
	const { refetch } = useProposals()
	const { title, creator } = proposal
	const { address } = useAccount()
	const status = useProposalStatus(id)

	return (
		<Link className={`proposal-teaser ${className}`} to={`/proposal/${id}`}>
			<ProposalHeader>Proposal</ProposalHeader>
			<NumberHeader>Number</NumberHeader>
			<StatusHeader className={status?.className}>
				<Skeleton>{status?.title}</Skeleton>
			</StatusHeader>

			<TitleData>
				<Skeleton>{title}</Skeleton>
			</TitleData>
			<NumberData>
				<Skeleton>{proposal.id}</Skeleton>
			</NumberData>
			<StatusData>
				{status?.type === 'countdown' ? (
					<Statistic.Countdown value={status?.value} className={status?.className} onFinish={refetch} />
				) : (
					<Statistic value={status?.value} className={status?.className} />
				)}
			</StatusData>

			<Votes id={id} />

			<ViewProposalButton size="large">View Proposal</ViewProposalButton>

			<Address>
				Submitted by: {truncateString(creator)}
				{creator?.toLowerCase() === address?.toLowerCase() && <StarFilled />}
			</Address>
		</Link>
	)
})`
	display: grid;
	grid-template: auto auto auto / 1fr auto auto;
	grid-column-gap: 2rem;
	grid-row-gap: 0.5rem;
	grid-template-areas:
		'proposalheader numberheader statusheader'
		'title number status'
		'votes votes votes'
		'submitted submitted submitted';

	padding: 2rem;
	border-radius: 1rem;
	background: var(--color-popover-background);
	box-shadow: 0 0 rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease-in-out;
	cursor: pointer;

	&:hover {
		background: var(--color-popover-lighter-background);
		box-shadow: 0.2rem 0.4rem 1rem rgba(0, 0, 0, 0.05);
		transform: translateY(-1px);
	}

	@media screen and (max-width: 960px) {
		grid-template: auto / auto;
		grid-gap: 0;
		grid-template-areas:
			'proposalheader'
			'title'
			'statusheader'
			'status'
			'votes'
			'viewbutton'
			'submitted';
	}
`

const Header = styled(props => <Typography.Title level={5} ellipsis {...props} />)`
	&&& {
		margin: 0;
		color: inherit;
	}
`
const ProposalHeader = styled(Header)`
	grid-area: proposalheader;
`
const NumberHeader = styled(Header)`
	grid-area: numberheader;

	@media screen and (max-width: 960px) {
		display: none;
	}
`
const StatusHeader = styled(Header)`
	grid-area: statusheader;

	&.status-passed {
		color: var(--color-status-success);
	}
	&.status-rejected {
		color: var(--color-status-failure);
	}
`

const Data = styled(props => <Typography.Title level={3} ellipsis {...props} />)`
	&&& {
		margin: 0;

		@media screen and (max-width: 960px) {
			margin-bottom: 1rem;
		}
	}
`
const TitleData = styled(Data)`
	grid-area: title;
`
const NumberData = styled(Data)`
	grid-area: number;

	@media screen and (max-width: 960px) {
		display: none;
	}
`
const StatusData = styled(Data)`
	grid-area: status;
`

const Votes = styled(ProposalVotes)`
	grid-area: votes;
	margin: 1rem 0;
`

const ViewProposalButton = styled(Button)`
	display: none;
	grid-area: viewbutton;
	margin: 1rem 0;

	@media screen and (max-width: 960px) {
		display: block;
	}
`

const Address = styled(props => <Typography.Text disabled {...props} />)`
	grid-area: submitted;
	justify-self: end;

	.anticon-star {
		color: var(--color-gold);
		margin-left: 0.2em;
	}
`
