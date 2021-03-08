import React, { useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import styled from 'styled-components'
import { Layout, Menu } from 'antd';
import { Account, Network } from '@archetypes'
import { useTracer, useDao } from '@libs/tracer'
import { useAccount } from '@libs/web3'
import { fromWei, numberToMaxDb } from '@util/helpers'
import { ReactComponent as Logo } from '@assets/logo.svg';

const StyledLogo = styled(Logo)`
	margin-right: 5.7em;
	width: 14.5rem;
	height: 3.4rem;
	color: white;
`

const StyledMenu = styled(Menu)`
	height: 86px;
	line-height: 86px;
	background: transparent !important;
`

const StyledMenuItem = styled(Menu.Item)`
	font-size: 1.8rem;
	line-height: 86px;
	background-color: transparent !important;
	padding: 0 24px;
	position: relative;
	color: white;

	>a{
		transition: color 0.5s;
		&:after{
			content: '';
			bottom: 0;
			left: 0;
			width: 100%;
			height: 0;
			background: white;
			display: block;
			transition: all 0.2s ease-in-out;
			position: absolute;
			opacity: 0;
		}

		&[datatype="SELECTED"]:after {
			height: 0.2rem;
			opacity: 1;
		}
	}
`

const SubMenu = styled(StyledMenu)
`
	height: 40px;
	line-height: 40px;
	margin: auto;
	background: #fff;
`

const SubMenuItem = styled(StyledMenuItem)
`
	font-size: 1.5rem;
	line-height: 40px;
`

export default styled(
	({
		className
	}) => {
		
		const { userBalance } = useTracer();
		const { userStaked } = useDao();
		const { status } = useAccount();
		const [selected, setSelected] = useState(["1"]);
		return <Layout.Header 
			className={className}
			>
			<div className="row">
				<div 
					className="col left"
					>
					<Link 
						to='/'
						>
						<StyledLogo/>
					</Link>
					<StyledMenu 
						theme="dark" 
						mode="horizontal" 
						selectedKeys={selected}
						onSelect={({ key }) => { key === "2" ? setSelected([key, "4"]) : setSelected([key]) }}
						>
						<StyledMenuItem key="1">
							<NavLink datatype={selected.includes("1") ? "SELECTED" : ""} exact to='/' >Proposals</NavLink>
						</StyledMenuItem>
						<StyledMenuItem key="2">
							<NavLink datatype={selected.includes("2") ? "SELECTED" : ""}to='/allocation/chart'>Allocation</NavLink>
						</StyledMenuItem>
						<StyledMenuItem key="3">
							<NavLink datatype={selected.includes("3") ? "SELECTED" : ""} to='/dashboard'>Stake</NavLink>
						</StyledMenuItem>
					</StyledMenu>
				</div>
				<div 
					className="col right"
					>
					
					{
						status === 'CONNECTED' && 
						<span
							className='balance'
							>
							<div>TCR: {numberToMaxDb(fromWei(userBalance), 5)}</div>
							<div>STAKED: {numberToMaxDb(fromWei(userStaked), 5)}</div>
						</span>
					}
					<Network.Badge/>
					<Account.Button/>
				</div>
			</div>
			<div className="row subMenu" datatype={selected[0] === "2" ? "DISPLAY" : "NO_DISPLAY"}>
				<SubMenu
					theme="dark" 
					mode="horizontal"
					selectedKeys={selected}
					onSelect={({ key }) => setSelected(["2", key]) }
					>
					<SubMenuItem key="4">
						<NavLink datatype={selected.includes("4") ? "SELECTED" : ""} to='/allocation/chart'>Chart</NavLink>
					</SubMenuItem>
					<SubMenuItem key="5">
						<NavLink datatype={selected.includes("5") ? "SELECTED" : ""}to='/allocation/stakers'>Stakers</NavLink>
					</SubMenuItem>
				</SubMenu>
			</div>
		</Layout.Header>
	})
	`
	align-items: center;
	justify-content: space-between;
	height: auto;
	padding: 0 40px;
	background: var(--color-primary);
	color: var(--color-light);

	> .row {
		display: flex;
		justify-content: space-between;
	}

	> .subMenu {
		&[datatype="NO_DISPLAY"] {
			display: none;
		}
	}

	
	> .row > .col{
		display: flex;
		align-items: center;

		&.right{
			line-height: 1em;

			.balance{
				font-size: 12px;
				margin-right: 1em;
				>*{
					line-height: 1.2em;
					text-align: right;
				}
			}
		}
	}

	.account-button{
		background: white !important;
		color: var(--color-primary) !important
	}

		
	`