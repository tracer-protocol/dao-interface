import { Button, DataLoader, Filter } from 'components'
import { useProposals } from 'libs/tracer'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

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
				<Link to="/proposal/new">
					<Button size="large" type="inverse">
						New Proposal
					</Button>
				</Link>
			</div>

			<DataLoader loading={loading} noresults={proposals.length <= 0}>
				{proposals.map(({ id }) => (
					<Teaser key={id} id={id} />
				))}
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

	.proposal-teaser + .proposal-teaser {
		margin-top: 1em;
	}
`
