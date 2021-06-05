import { ReactComponent as TracerBlogLogo } from 'assets/tracer_blog.svg'
import { ReactComponent as TracerGovernLogo } from 'assets/tracer_govern.svg'
import { ReactComponent as TracerLogo } from 'assets/tracer_logo.svg'
import { ReactComponent as TracerPerpetualsLogo } from 'assets/tracer_perps.svg'
import { ReactComponent as TriangleDown } from 'assets/triangle_down_cropped.svg'
import MobileSocialLogos from 'components/MobileSocialLogos'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export default function HeaderSiteSwitcher() {
	return (
		<StyledHeaderSiteSwitcher>
			<MainLink to="/">
				<StyledTracerGovernLogo />
			</MainLink>

			<StyledTriangleDown />

			<Menu>
				<MenuItem>
					<Link to="/">
						<StyledTracerGovernLogo />
					</Link>
				</MenuItem>
				<MenuItem>
					<a href="https://tracer.finance">
						<StyledTracerLogo />
					</a>
				</MenuItem>
				<MenuItem>
					<a href="https://tracer.finance/exchange/">
						<StyledTracerPerpetualsLogo />
					</a>
				</MenuItem>
				<MenuItem>
					<a href="https://tracer.finance/radar">
						<StyledTracerBlogLogo />
					</a>
				</MenuItem>
				<MenuItem>
					<StyledMobileSocialLogos />
				</MenuItem>
			</Menu>
		</StyledHeaderSiteSwitcher>
	)
}

const MainLink = styled(Link)`
	z-index: 11;
`

const StyledTriangleDown = styled(TriangleDown)`
	height: 2rem;
	transition: all 400ms ease-in-out;
	z-index: 11;
`

const StyledTracerLogo = styled(TracerLogo)`
	display: block;
	height: 2.8rem;
	margin-right: 2rem;
`
const StyledTracerPerpetualsLogo = styled(TracerPerpetualsLogo)`
	display: block;
	height: 2.8rem;
	margin-right: 2rem;
`
const StyledTracerGovernLogo = styled(TracerGovernLogo)`
	display: block;
	height: 2.8rem;
	margin-right: 2rem;
`
const StyledTracerBlogLogo = styled(TracerBlogLogo)`
	display: block;
	height: 2.8rem;
	margin-right: 2rem;
`

const Menu = styled.div`
	position: absolute;
	top: -2rem;
	left: -3.5rem;
	right: -3.5rem;
	padding: 2rem 0;
	opacity: 0;
	background: var(--color-popover-lighter-background);
	border-radius: 1rem;
	transform-origin: top center;
	transform: scale(0.7, 0);
	transition: all 500ms ease-in-out;
	z-index: 10;
`
const MenuItem = styled.div`
	border-bottom: 1px solid var(--color-primary);
	transition: all 400ms ease;

	&:not(:first-child) {
		opacity: 0;
		padding-left: 3rem;
	}

	> a {
		display: block;
		padding: 2rem 3.5rem;
		transition: all 300ms ease;
	}
	&:first-child > a {
		padding-top: 0;
		opacity: 0;
	}
	&:not(:first-child) > a:hover {
		background: var(--color-primary);
	}

	&:last-child {
		padding: 2rem 3.5rem 0 3.5rem;
		border-bottom: none;
	}
`

const StyledMobileSocialLogos = styled(MobileSocialLogos)`
	width: 60%;

	& > *,
	& > *:hover,
	& > *:focus,
	& > *:active {
		font-size: 3rem;
	}
`

const StyledHeaderSiteSwitcher = styled.div`
	position: relative;
	display: flex;
	align-items: center;

	&:hover {
		${StyledTriangleDown} {
			transform: rotate(180deg);
		}

		${Menu} {
			opacity: 1;
			transform: none;
		}
		${MenuItem} {
			opacity: 1;
			padding-left: 0;

			&:last-child {
				padding-left: 3.5rem;
			}
		}
		${MenuItem}:nth-child(2) {
			transition: all 400ms ease 300ms;
		}
		${MenuItem}:nth-child(3) {
			transition: all 400ms ease 450ms;
		}
		${MenuItem}:nth-child(4) {
			transition: all 400ms ease 600ms;
		}
		${MenuItem}:nth-child(5) {
			transition: all 400ms ease 750ms;
		}
		${MenuItem}:nth-child(6) {
			transition: all 400ms ease 900ms;
		}
	}
`
