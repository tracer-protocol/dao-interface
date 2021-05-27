import Icon, { GithubOutlined, TwitterOutlined } from '@ant-design/icons'
import { ReactComponent as DiscordLogo } from 'assets/discord-logo-white.svg'
import { ReactComponent as DiscourseLogo } from 'assets/discourse-logo-white.svg'
import styled from 'styled-components'

export default styled(props => (
	<div {...props}>
		<a href="https://discourse.tracer.finance/">
			<Icon component={DiscourseLogo} />
		</a>
		<a href="https://github.com/tracer-protocol/">
			<GithubOutlined />
		</a>
		<a href="https://discord.gg/sS7QFWWyYa">
			<Icon component={DiscordLogo} />
		</a>
		<a href="https://twitter.com/tracer_finance">
			<TwitterOutlined />
		</a>
	</div>
))`
	width: 100%;
	height: 100%;
	max-width: 38rem;
	display: flex;
	justify-content: space-between;
	align-items: center;

	& > *,
	& > *:hover,
	& > *:focus,
	& > *:active {
		font-size: 4rem;
		color: var(--color-light);
	}
`
