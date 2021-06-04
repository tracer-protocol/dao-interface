import { useDao, useTracer } from '@libs/tracer'
import { useAccount } from '@libs/web3'
import { Form, Input } from 'antd'
import Button from 'components/Button'
import Max from 'components/Max'
import Panel from 'components/Panel'
import { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'

import AccountButton from './Button'

const modes = [
	{ key: 'stake', title: 'Stake' },
	{ key: 'withdraw', title: 'Withdraw' },
]

export default styled(({ className }) => {
	const { userStaked, __STAKE, __WITHDRAW } = useDao()
	const { userBalance } = useTracer()
	const { status } = useAccount()

	const formRef = useRef()
	const [mode, setMode] = useState(modes[0]?.key)

	const setFieldToMaxValue = useCallback(
		event => {
			event.preventDefault()

			const max = mode === 'stake' ? userBalance : mode === 'withdraw' ? userStaked : false
			if (!max) return

			formRef.current.setFieldsValue({ amount: Web3.utils.fromWei(max) })
		},
		[mode, userBalance, userStaked]
	)

	const checkValidAmount = useCallback(
		async (rule, value) => {
			const amount = parseFloat(value)
			const balance =
				mode === 'stake' ? userBalance : mode === 'withdraw' ? parseFloat(Web3.utils.fromWei(userStaked)) : 0

			if (!amount) {
				const action = mode === 'stake' ? ' to stake' : mode === 'withdraw' ? ' to withdraw' : ''
				const message = `Please enter an amount${action}`
				throw new Error(message)
			}

			if (balance < amount) {
				const message =
					mode === 'stake'
						? "You don't have enough TCR to stake this amount."
						: mode === 'withdraw'
						? 'You have not staked enough to withdraw this amount.'
						: ''
				throw new Error(message)
			}
		},
		[mode, userBalance, userStaked]
	)

	const onToggleChange = useCallback(() => {
		setMode(mode => modes.find(aMode => aMode.key !== mode)?.key)
		formRef.current.validateFields(['amount'])
	}, [])

	return (
		<div className={className}>
			<Container>
				<Toggle className="toggle" options={modes} value={mode} onChange={onToggleChange} />
				<Panel>
					<Form
						layout="vertical"
						size="large"
						onFinish={values => {
							if (mode === 'stake') return __STAKE(Web3.utils.toWei(values.amount))
							if (mode === 'withdraw') return __WITHDRAW(Web3.utils.toWei(values.amount))
						}}
						requiredMark={false}
						ref={formRef}
					>
						<Form.Item
							label={mode === 'stake' ? 'Amount to Stake' : mode === 'withdraw' ? 'Amount to Withdraw' : ''}
							name="amount"
							onChange={event => {
								event.preventDefault()
								formRef.current.validateFields(['amount'])
							}}
							required={false}
							rules={[{ validator: checkValidAmount }]}
						>
							<Input type="number" addonAfter={<Max onClick={setFieldToMaxValue}>Max</Max>} />
						</Form.Item>
						<Form.Item className="submit">
							{status !== 'CONNECTED' ? (
								<AccountButton className="button" />
							) : (
								<Button size="large" className="button" htmlType="submit">
									{mode === 'stake' ? 'Stake' : mode === 'withdraw' ? 'Withdraw' : ''}
								</Button>
							)}
						</Form.Item>
					</Form>
				</Panel>
			</Container>
		</div>
	)
})`
	display: flex;
	justify-content: center;

	.ant-form-item-label {
		text-align: center;
		margin-bottom: 1rem;

		> * {
			font-size: var(--font-size-medium);
			color: var(--color-primary);
		}
	}

	.submit {
		text-align: center;
		margin-bottom: 0;

		.button {
			margin: 2rem auto 0 auto;
		}
	}
`

const Container = styled.div`
	width: 100%;
	max-width: 40rem;

	> .toggle {
		margin: 0 6rem 2rem 6rem;
	}

	@media screen and (max-width: 960px) {
		max-width: unset;
	}
`

const Toggle = styled(({ options, value, onChange, ...props }) => {
	const left = options[0]
	const right = options[1]

	return (
		<div {...props} onClick={() => onChange()}>
			<div className={`active-background ${value === right?.key ? 'right' : 'left'}`} />
			<div className={`option left ${value !== right?.key && 'active'}`}>{left?.title}</div>
			<div className={`option right ${value === right?.key && 'active'}`}>{right?.title}</div>
		</div>
	)
})`
	display: flex;
	align-items: center;
	position: relative;
	padding: 1rem 0;
	border: 0.1rem solid var(--color-border-base);
	border-radius: 99999999999rem;
	user-select: none;
	cursor: pointer;

	.option {
		flex: 1 1 0;
		position: relative;
		transition: color 300ms ease;
		text-align: center;

		&.active {
			color: var(--color-component-background);
		}
	}

	.active-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		border-radius: 99999999999rem;
		background: var(--color-light);
		transition: all 300ms ease;

		&.right {
			left: 50%;
		}
	}
`
