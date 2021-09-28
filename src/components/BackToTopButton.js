import { Button } from 'antd'
import styled from 'styled-components'

export default function BackToTopButton({ ...props }) {
	return (
		<StyledButton
			size="large"
			onClick={() => {
				document.body.scrollTop = 0
				document.documentElement.scrollTop = 0
			}}
			{...props}
		>
			Back to top
		</StyledButton>
	)
}

const StyledButton = styled(Button)`
	display: none;

	@media screen and (max-width: 960px) {
		display: block;
	}
`
