import { fromWei, numberToMaxDb } from 'util/helpers'

import { CloseOutlined, MenuOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { Account, Network } from 'archetypes'
import { ReactComponent as TracerBlogLogo } from 'assets/tracer_blog.svg'
import { ReactComponent as TracerGovernLogo } from 'assets/tracer_govern.svg'
import { ReactComponent as TracerLogo } from 'assets/tracer_logo.svg'
import { ReactComponent as TracerPerpetualsLogo } from 'assets/tracer_perps.svg'
import FlexSpace from 'components/FlexSpace'
import MobileSocialLogos from 'components/MobileSocialLogos'
import WrapContainer from 'components/WrapContainer'
import useBooleanState from 'hooks/useBooleanState'
import { useDao, useTracer } from 'libs/tracer'
import { useAccount } from 'libs/web3'
import { useMemo } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'

const menu = [
	{ title: 'Proposals', url: '/', exact: true },
	{ title: 'Allocation', url: '/allocation/chart', matchUrl: '/allocation' },
	{ title: 'Stake', url: '/dashboard' },
]
const allocationSubmenu = [
	{ title: 'Chart', url: '/allocation/chart' },
	{ title: 'Stakers', url: '/allocation/stakers' },
]

export default styled(({ className }) => {
	const { userBalance } = useTracer()
	const { userStaked } = useDao()
	const { status } = useAccount()
	const selectedMenuKeys = useSelectedMenuKeys()
	const [showMobileMenu, toggleMobileMenu] = useBooleanState(false)

	return (
		<Layout.Header className={className}>
			<Row desktop>
				<Link to="/">
					<StyledTracerGovernLogo />
				</Link>
				<FlexSpace />
				<StyledMenu theme="dark" mode="horizontal" selectedKeys={selectedMenuKeys}>
					{menu.map(({ title, url, exact }) => (
						<StyledMenuItem key={titleToKey(title)}>
							<NavLink exact={exact} to={url}>
								{title}
							</NavLink>
						</StyledMenuItem>
					))}
				</StyledMenu>
				<div style={{ marginLeft: 20 }} />
				<Account.AirdropButton />
				{status === 'CONNECTED' && (
					<UserBalance>
						<div>TCR: {numberToMaxDb(fromWei(userBalance), 5)}</div>
						<div>STAKED: {numberToMaxDb(fromWei(userStaked), 5)}</div>
					</UserBalance>
				)}
				<Network.Badge />
				<Account.Button />
			</Row>
			<Row mobile>
				<Link to="/">
					<StyledTracerGovernLogo />
				</Link>
				<FlexSpace />
				<div style={{ height: '8.6rem' }} />
				<MenuButton onClick={toggleMobileMenu} />
			</Row>
			<MobileMenu visible={showMobileMenu}>
				<CloseMenuButton onClick={toggleMobileMenu} />
				<MobileMenuItem>Menu</MobileMenuItem>
				{menu.map(({ title, url, exact }) => (
					<MobileMenuItem key={titleToKey(title)}>
						<NavLink exact={exact} to={url} onClick={toggleMobileMenu}>
							{title}
						</NavLink>
					</MobileMenuItem>
				))}
				<FlexSpace />
				<MobileMenuItem>
					<a href="https://tracer.finance">
						<StyledTracerLogo />
					</a>
				</MobileMenuItem>
				<MobileMenuItem>
					<a href="https://tracer.finance/exchange/">
						<StyledTracerPerpetualsLogo />
					</a>
				</MobileMenuItem>
				<MobileMenuItem>
					<Link to="/" onClick={toggleMobileMenu}>
						<StyledTracerGovernLogo />
					</Link>
				</MobileMenuItem>
				<MobileMenuItem>
					<a href="https://tracer.finance/radar">
						<StyledTracerBlogLogo />
					</a>
				</MobileMenuItem>
				<MobileMenuItem>
					<MobileSocialLogos />
				</MobileMenuItem>
			</MobileMenu>
			<Row subMenu visible={selectedMenuKeys.includes('allocation')}>
				<SubMenu theme="dark" mode="horizontal" selectedKeys={selectedMenuKeys}>
					{allocationSubmenu.map(({ title, url, exact }) => (
						<SubMenuItem key={titleToKey(title)}>
							<NavLink exact={exact} to={url}>
								{title}
							</NavLink>
						</SubMenuItem>
					))}
				</SubMenu>
			</Row>
		</Layout.Header>
	)
})`
	align-items: center;
	justify-content: space-between;
	height: auto;
	padding: 0;
`

const Row = styled(WrapContainer)`
	display: flex;
	justify-content: space-between;
	align-items: center;

	${props =>
		props.desktop &&
		css`
			@media screen and (max-width: 960px) {
				display: none;
			}
		`}

	${props =>
		props.mobile &&
		css`
			display: none;
			@media screen and (max-width: 960px) {
				display: flex;
			}
		`}

	${props =>
		props.subMenu &&
		css`
			height: 0rem;
			overflow: hidden;
			transition: all 500ms ease;

			${props =>
				props.visible &&
				css`
					height: 4rem;
				`}
		`}
`

const StyledTracerLogo = styled(TracerLogo)`
	display: block;
	height: 2.8rem;
	margin-right: 0.5rem;
`
const StyledTracerPerpetualsLogo = styled(TracerPerpetualsLogo)`
	display: block;
	height: 2.8rem;
	margin-right: 0.5rem;
`
const StyledTracerGovernLogo = styled(TracerGovernLogo)`
	display: block;
	height: 2.8rem;
	margin-right: 0.5rem;
`
const StyledTracerBlogLogo = styled(TracerBlogLogo)`
	display: block;
	height: 2.8rem;
	margin-right: 0.5rem;
`

const StyledMenu = styled(Menu)`
	height: 8.6rem;
	line-height: 8.6rem;
`
const StyledMenuItem = styled(Menu.Item)`
	font-size: 1.8rem;
	line-height: 8.6rem;

	> a {
		transition: color 500ms ease;
	}
`
const SubMenu = styled(StyledMenu)`
	height: 4rem;
	line-height: 4rem;
`
const SubMenuItem = styled(StyledMenuItem)`
	font-size: 1.5rem;
	line-height: 4rem;
`

const MenuButton = styled(MenuOutlined)`
	font-size: 3rem;
	cursor: pointer;
`
const CloseMenuButton = styled(CloseOutlined)`
	position: absolute;
	top: 4.3rem;
	right: 3.3rem;
	transform: translateY(-50%);
	font-size: 3rem;
	cursor: pointer;
`

const UserBalance = styled.span`
	font-size: 1.2rem;
	margin-right: 1em;
	> * {
		line-height: 1.2em;
		text-align: right;
	}
`

const MobileMenu = styled.div`
	display: none;
	flex-direction: column;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	overflow-y: auto;
	color: var(--color-light);
	background: var(--color-popover-lighter-background);
	z-index: 999;

	${props =>
		props.visible &&
		css`
			display: flex;
		`}
`
const MobileMenuItem = styled.div`
	width: 100%;
	height: 8.6rem;
	padding: 0 3.3rem;
	line-height: 8.6rem;
	font-size: 3rem;
	flex-shrink: 0;

	&:not(:last-child) {
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}
	${FlexSpace} + & {
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}

	> a {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		color: var(--color-light);
	}
`

const titleToKey = title => title.toLowerCase()

function useSelectedMenuKeys() {
	const location = useLocation()
	const selectedMenuKeys = useMemo(
		() =>
			[...menu, ...allocationSubmenu]
				.map(
					({ title, url, matchUrl, exact }) =>
						(exact ? location.pathname === (matchUrl || url) : location.pathname.startsWith(matchUrl || url)) &&
						titleToKey(title)
				)
				.filter(Boolean),
		[location]
	)

	return selectedMenuKeys
}
