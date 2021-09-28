import { Layout } from 'antd'
import { ReactComponent as TracerGovernLogo } from 'assets/tracer_govern.svg'
import FlexSpace from 'components/FlexSpace'
import { menu } from 'components/Header'
import MobileSocialLogos from 'components/MobileSocialLogos'
import WrapContainer from 'components/WrapContainer'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default function Footer() {
	return (
		<StyledFooter>
			<WrapContainer>
				<Border />

				<Row>
					<LogoLink to="/" />

					<FooterLinks>
						{menu.map(({ title, url }) => (
							<FooterLink key={url} to={url}>
								{title}
							</FooterLink>
						))}
					</FooterLinks>

					<FlexSpace />

					<SitesNav>
						<a href="https://tracer.finance">Main Site</a>
						<a href="https://tracer.finance/radar">Tracer Blog</a>
					</SitesNav>
					<Copyright>© 2021 Tracer Ltd</Copyright>

					<StyledMobileSocialLogos />
				</Row>
			</WrapContainer>
		</StyledFooter>
	)
}

const StyledFooter = styled(Layout.Footer)`
	padding-left: 0;
	padding-right: 0;
`
const Border = styled.div`
	width: 100%;
	margin-bottom: 2rem;
	border-top: 1px solid var(--color-border-base);
`
const Row = styled.div`
	display: grid;
	grid-template: auto / auto auto 1fr auto auto auto;
	grid-template-areas: 'logo nav . sitesnav copyright sociallinks';
	align-items: center;

	@media screen and (max-width: 960px) {
		grid-template: auto auto auto auto / auto auto;
		grid-template-areas:
			'logo logo'
			'nav sitesnav'
			'nav copyright'
			'sociallinks sociallinks';
	}
`
const LogoLink = styled(props => (
	<Link {...props}>
		<TracerGovernLogo />
	</Link>
))`
	grid-area: logo;
	justify-self: start;
	margin-right: 0.5rem;

	svg {
		display: block;
		height: 2rem;
	}

	@media screen and (max-width: 960px) {
		margin-right: 0;
		margin-bottom: 2rem;
	}
`
const FooterLinks = styled.div`
	grid-area: nav;
`
const FooterLink = styled(Link)`
	margin-left: 3rem;
	color: var(--color-light);

	@media screen and (max-width: 960px) {
		display: block;
		margin-left: 0;
		margin-bottom: 1rem;
	}
`
const SitesNav = styled.div`
	grid-area: sitesnav;

	& > * {
		margin-right: 3rem;
		color: var(--color-light);
	}

	@media screen and (max-width: 960px) {
		& > * {
			display: block;
			margin-right: 0;
			margin-bottom: 1rem;
		}
	}
`
const Copyright = styled.div`
	grid-area: copyright;
	margin-right: 1rem;

	@media screen and (max-width: 960px) {
		margin-right: 0;
		margin-bottom: 1rem;
	}
`
const StyledMobileSocialLogos = styled(MobileSocialLogos)`
	grid-area: sociallinks;

	& > *,
	& > *:hover,
	& > *:focus,
	& > *:active {
		font-size: 2rem;
		margin-left: 1.5rem;
	}

	@media screen and (max-width: 960px) {
		margin-top: 2rem;

		& > *,
		& > *:hover,
		& > *:focus,
		& > *:active {
			margin-left: 0;
			font-size: 3rem;
		}
	}
`
