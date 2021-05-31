import 'App.Style.less'

import { Layout } from 'antd'
import { networkConfig } from 'App.Config'
import { Base as StyleBase, Fonts as StyleFonts, Layout as StyleLayout, Theme as StyleTheme } from 'App.Style'
import { Header, Loading, Notification, WrapContainer } from 'components'
import { GraphProvider } from 'libs/graph'
import { TracerProvider } from 'libs/tracer'
import { Web3Provider } from 'libs/web3'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Allocation, Dashboard, Proposal, ProposalNew, Proposals } from 'routes'
import styled from 'styled-components'

const StyledLayout = styled(Layout)`
	position: relative;
	min-height: 100%;
`
const StyledContent = styled(({ children, ...props }) => (
	<Layout.Content {...props}>
		<WrapContainer>{children}</WrapContainer>
	</Layout.Content>
))`
	padding: 3.5rem 0;

	@media screen and (max-width: 960px) {
		padding: 1rem 0;
	}
`

const Details = () => (
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
