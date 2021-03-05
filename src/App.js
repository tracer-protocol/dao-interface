import React from 'react';
import styled from 'styled-components'
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from 'antd';
import { Header, Loading, Notification } from '@components'
import { Proposals, Proposal, ProposalNew, Allocation, Dashboard } from '@routes'
import { Web3Provider } from '@libs/web3'
import { GraphProvider } from '@libs/graph'
import { TracerProvider } from '@libs/tracer'
import { networkConfig } from './App.Config'
import "antd/dist/antd.css";

import { 
	Fonts as StyleFonts,
	Vars as StyleVars,
	Base as StyleBase,
	Layout as StyleLayout,
	Theme as StyleTheme,
} from './App.Style'

const StyledContent = styled(Layout.Content)`
	padding: 3.5rem 4rem;
`

const Details = () =>  
	<Layout style={{minHeight: '100vh'}}>
		<Router  basename="/">
			<Header />
			<Loading/>
			<StyledContent>
				<Switch>
					<Route exact path="/">
						<Proposals/>
					</Route>
					<Route exact path="/proposal/new">
						<ProposalNew/>
					</Route>
					<Route exact path="/proposal/:id">
						<Proposal/>
					</Route>
					<Route exact path="/allocation/members">
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
	</Layout>


// FYI: need to use anon function 
// in order to allow FAST_REFRESH 
// to work in CRA 4.0.1
export default function App() {
	return <Web3Provider 
		networkConfig={networkConfig}
		>
		<GraphProvider>
			<TracerProvider>
				<StyleFonts/>
				<StyleVars/>
				<StyleBase/>
				<StyleLayout/>
				<StyleTheme/>
				<Notification/>
				<Details/>
			</TracerProvider>
		</GraphProvider>
	</Web3Provider>
}