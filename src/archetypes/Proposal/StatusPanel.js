import { useDao, useTracer } from '@libs/tracer'
import { useAccount } from '@libs/web3'
import { fromWei } from '@util/helpers'
import { Row } from 'antd'
import Button from 'components/Button'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Panel = styled(({ id, className }) => {
	const { userStaked } = useDao()
	const { userBalance } = useTracer()
	const { status } = useAccount()

	return (
		<div className={className}>
			<div className="title">
				<a href="https://vote.tracer.finance/" target="_blank" rel="noreferrer noopener">
					<Button size="large" type="primary">
						Vote On Snapshot
					</Button>
				</a>
			</div>

			<Row justify="center">
				{status === 'CONNECTED' && parseInt(fromWei(userBalance)) >= 1 && parseInt(fromWei(userStaked)) === 0 && (
					<Link to="/dashboard">
						<Button type="primary" className="stake" onClick={() => null}>
							Stake
						</Button>
					</Link>
				)}
			</Row>
		</div>
	)
})`
	.status {
		display: flex;
		align-items: center;
		justify-content: space-between;

		&:first-child {
			text-align: left;
		}

		&:last-child {
			text-align: right;
		}

		.ant-statistic-content {
			font-size: 2.4rem;
		}
	}

	> .title {
		margin: 1.7em 0 1em 0;
		display: block;
		text-align: center;

		> .ant-typography {
			display: block;
			text-align: center;
		}
	}

	.stake {
		margin-top: 2rem;
	}

	.widgetbar {
		> .title {
			width: 10rem;
			white-space: nowrap;
		}

		> .chart {
			width: calc(100% - 20rem);
		}

		> .button {
			width: 10rem;
		}

		& + .widgetbar {
			margin-top: 0.5em;
		}
	}
`
export default Panel
