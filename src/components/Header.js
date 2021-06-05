import { fromWei, numberToMaxDb } from 'util/helpers'

import { Layout, Menu } from 'antd'
import { Account, Network } from 'archetypes'
import { ReactComponent as TracerBlogLogo } from 'assets/tracer_blog.svg'
import { ReactComponent as TracerGovernLogo } from 'assets/tracer_govern.svg'
import { ReactComponent as TracerLogo } from 'assets/tracer_logo.svg'
import { ReactComponent as TracerPerpetualsLogo } from 'assets/tracer_perps.svg'
import FlexSpace from 'components/FlexSpace'
import HeaderSiteSwitcher from 'components/HeaderSiteSwitcher'
import MobileSocialLogos from 'components/MobileSocialLogos'
import WrapContainer from 'components/WrapContainer'
import { AnimatePresence, motion } from 'framer-motion'
import useBooleanState from 'hooks/useBooleanState'
import { useDao, useTracer } from 'libs/tracer'
import { useAccount } from 'libs/web3'
import { useMemo } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const menu = [
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
			<HeaderBackground />
			<Row desktop>
				<HeaderSiteSwitcher />
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
				<MobileMenuButton close={showMobileMenu} onClick={toggleMobileMenu} />
			</Row>
			<AnimatePresence>
				{showMobileMenu && (
					<MobileMenu initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
				)}
			</AnimatePresence>
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
	position: relative;
	align-items: center;
	justify-content: space-between;
	height: auto;
	padding: 0;
	background: none;

	> * {
		position: relative;
	}
`

const HeaderBackground = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #03065e;
	z-index: 0;
	overflow: hidden;

	&:before,
	&:after {
		content: '';
		height: 100%;
		position: absolute;
	}
	&:before {
		top: 0;
		left: 0;
		height: 16rem;
		width: 50%;
		transform: skewX(60deg);
		background: #00217c;
	}
	&:after {
		top: 0;
		left: 0;
		width: calc(50% - 400px);
		background: #002c89;
		box-shadow: 0 2rem 10rem rgba(0, 0, 0, 0.2);
	}

	@media screen and (max-width: 1600px) {
		&:after {
			width: 30%;
		}
	}
	@media screen and (max-width: 1300px) {
		&:before {
			width: 50%;
		}
		&:after {
			width: 35%;
		}
	}

	@media screen and (max-width: 960px) {
		&:before {
			width: 95%;
		}
		&:after {
			width: 50%;
		}
	}

	@media screen and (max-width: 640px) {
		&:after {
			width: 70%;
		}
	}
	@media screen and (max-width: 440px) {
		&:after {
			width: 100%;
		}
	}
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
	display: flex;
	height: 8.6rem;
`
const StyledMenuItem = styled(Menu.Item)`
	&&& {
		display: flex;
		align-items: stretch;
	}
	font-size: 1.8rem;

	> a {
		display: flex;
		align-items: center;
		transition: color 500ms ease;
	}
`
const SubMenu = styled(StyledMenu)`
	height: 4rem;
`
const SubMenuItem = styled(StyledMenuItem)`
	font-size: 1.5rem;
`

const MobileMenuButton = styled(props => (
	<button type="button" {...props}>
		<div className="icon">
			<span />
			<span />
			<span />
		</div>
	</button>
))`
	position: relative;
	display: block;
	width: 6rem;
	height: 8rem;
	cursor: pointer;
	font: inherit;
	color: inherit;
	text-transform: none;
	background-color: transparent;
	border: 0;
	padding: 0;
	margin: 0;
	z-index: 1000;

	&&&:hover,
	&&&:focus,
	&&&:active {
		opacity: 1;
	}

	> .icon {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 3rem;
		height: 2rem;
		transform: translate(-50%, -50%);
	}

	> .icon > span {
		position: absolute;
		top: 40;
		left: 0;
		display: block;
		width: 100%;
		height: 0.4rem;
		background: var(--color-light);
		transition: all 250ms ease;
	}
	> .icon > span:nth-child(1) {
		transform-origin: 10% 10%;
	}
	> .icon > span:nth-child(2) {
		top: 50%;
		transform: translateY(-50%);
	}
	> .icon > span:nth-child(3) {
		transform-origin: 10% 90%;
		top: auto;
		bottom: 0;
	}

	${props =>
		props.close &&
		css`
			> .icon > span:nth-child(1) {
				transform: rotate(45deg);
			}
			> .icon > span:nth-child(2) {
				opacity: 0;
			}
			> .icon > span:nth-child(3) {
				transform: rotate(-45deg);
			}
		`}
`

const UserBalance = styled.span`
	flex-shrink: 0;
	margin-right: 1em;
	font-size: 1.2rem;

	> * {
		line-height: 1.2em;
		text-align: right;
	}
`

const MobileMenu = motion(styled.div`
	display: flex;
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
`)
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
