import 'App.Style.less'

import { Layout } from 'antd'
import { networkConfig } from 'App.Config'
import { Base as StyleBase, Fonts as StyleFonts, Layout as StyleLayout, Theme as StyleTheme } from 'App.Style'
import { Header, Loading, Notification } from 'components'
import { GraphProvider } from 'libs/graph'
import { TracerProvider } from 'libs/tracer'
import { Web3Provider } from 'libs/web3'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import { Allocation, Dashboard, Proposal, ProposalNew, Proposals } from 'routes'
import styled from 'styled-components'

const StyledLayout = styled(Layout)`
	position: relative;
	min-height: 100%;
	.mobile {
		display: none;
		color: black;
		min-height: 100%;
		position: absolute;
		background: #f0f2f5;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 1000;
		max-width: 100%;
	}

	@media screen and (max-width: 768px) {
		.mobile {
			display: block;
		}
		display: none;
	}
`
const StyledContent = styled(Layout.Content)`
	padding: 3.5rem 4rem;
`

const Mobile = styled.div`
	display: none;
	color: black;
	min-height: 100vh;
	position: absolute;
	background: white;
	padding: 3rem;
	left: 0;
	top: 0;
	width: 100%;
	z-index: 1000;
	max-width: 100vw;

	h1 {
		margin: auto;
		color: #0000bd !important;
		text-align: center;
		font-weight: 500;
	}

	@media screen and (max-width: 768px) {
		display: flex;
	}
`

const Details = () => (
	<>
		<Mobile>
			<h1>We are currently optimising the mobile experience. For now please visit the site on a desktop.</h1>
		</Mobile>
		<StyledLayout>
			<Router basename="/">
				<Notification />
				<Header />
				<Loading />
				<StyledContent>
					<Switch>
						<Route exact path="/">
							<Proposals />
						</Route>
						<Route exact path="/proposal/new">
							<ProposalNew />
						</Route>
						<Route exact path="/proposal/:id">
							<Proposal />
						</Route>
						<Route exact path="/allocation/stakers">
							<Allocation.List />
						</Route>
						<Route exact path="/allocation/chart">
							<Allocation.Chart />
						</Route>
						<Route exact path="/dashboard">
							<Dashboard />
						</Route>
					</Switch>
				</StyledContent>
			</Router>
		</StyledLayout>
	</>
)

// FYI: need to use anon function
// in order to allow FAST_REFRESH
// to work in CRA 4.0.1
export default function App() {
	return (
		<Web3Provider networkConfig={networkConfig}>
			<GraphProvider>
				<TracerProvider>
					<StyleFonts />
					<StyleBase />
					<StyleLayout />
					<StyleTheme />
					<Notification />
					<Details />
				</TracerProvider>
			</GraphProvider>
		</Web3Provider>
	)
}
