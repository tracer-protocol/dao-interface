import BackToTopButton from 'components/BackToTopButton'
import Button from 'components/Button'
import DataLoader from 'components/DataLoader'
import Filter from 'components/Filter'
import { useProposals } from 'libs/tracer'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { statusOptions } from './config'
import Teaser from './Teaser'

export default styled(({ className }) => {
	const { proposals, loading, setFilter } = useProposals({ state: 'proposed' })

	return (
		<div className={className}>
			<div className="topbar">
				<Filter
					options={Object.values(statusOptions)}
					defaultSelected={[statusOptions.open.key]}
					onChange={type => setFilter('state', type[0])}
				/>
				<Link to="/proposal/new" className="new-proposal-link">
					<Button size="large" type="inverse">
						New Proposal
					</Button>
				</Link>
			</div>

			<Results hasResults={proposals.length > 0}>
				<DataLoader loading={loading} noresults={proposals.length <= 0}>
					{proposals.map(({ id }) => (
						<Teaser key={id} id={id} />
					))}
				</DataLoader>
				{proposals.length > 0 && <BackToTopButton />}
			</Results>
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

		.new-proposal-link {
			display: none;
		}
	}
`

const Results = styled.div`
	display: grid;
	grid-template: auto / auto;
	grid-gap: 1em;

	${props =>
		props.hasResults &&
		css`
			grid-template: auto / 1fr 1fr;
		`}

	@media screen and (max-width: 960px) {
		grid-template: auto / auto;
	}
`
