import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components'
import { Panel, Button, Max } from '@components'
import { Row, Col, Typography, Form, Input, Switch as AntSwitch } from 'antd'
import { useDao, useTracer } from '@libs/tracer'
import { Account } from '@archetypes'
import { useAccount } from '@libs/web3'
import Web3 from 'web3';

const Switch = styled(AntSwitch)
`
	background: #0000bd;
`

export default styled(
	({
		className
	}) => {

		const { userStaked, __STAKE, __WITHDRAW } = useDao();
		const { userBalance } = useTracer()
		const { status } = useAccount();
		const [toggle, setToggle] = useState(true);
		const formRef = React.createRef()

		const inputMax = (e) => {
			e.preventDefault();
			if (toggle) { // stake
				if (userBalance) { // user has no balance
					formRef.current.setFieldsValue({ amount: Web3.utils.fromWei(userBalance)})
				}
			} else { //withdraw
				if (userStaked) { // user has not staked
					formRef.current.setFieldsValue({ amount: Web3.utils.fromWei(userStaked)})
				}
			}
		}

		const checkValidAmount = (_rule, value, callback) => {
			const amount = parseFloat(value);
			const balance = toggle ? userBalance : parseFloat(Web3.utils.fromWei(userStaked));
			const message = !toggle ? 'You have not staked enough to withdraw this amount' : 'You dont have enough TCR to stake this amount'
			if(amount <= balance) {
				return callback()
			} else if (!amount) {
				return callback("Amount is required")
			}
			return callback(message)
		};



		useEffect(() => {
		}, [toggle]);

		return (
		<div className={className}>
			<div className="topbar">
				<Link to='/proposal/new'>
					<Button 
						size='large' 
						type="primary"
						>
						New Proposal
					</Button>
				</Link>
			</div>
			<Row gutter="24" justify="center" >
				<Col span="8">
					<Panel className="sPanel">
						<Row className="buttons">
							<Col span="24" align="right">
								<Form
									layout="vertical"
									size={'large'}
									onFinish={(values) => {
										if (toggle) { // stake
											__STAKE(Web3.utils.toWei(values.amount))
										} else { // withdraw
											__WITHDRAW(Web3.utils.toWei(values.amount))
										}
									}}
									requiredMark={false}
									ref={formRef}
								>
									<Switch 
										checkedChildren="Stake" 
										unCheckedChildren="Withdraw" 
										checked={toggle} 
										onChange={(value) => { 
											setToggle(value);
											formRef.current.validateFields(['amount']);
										}} 
									/>
									<Form.Item 
										label="Amount to Stake" 
										name="amount"
										onChange={(e) => {e.preventDefault(); formRef.current.validateFields(['amount']);}}
										required={false}
										rules={[
											{
												validator: checkValidAmount
											}
										]}
										>
										<Input type="number"
											addonAfter={
												<Max
													onClick={inputMax}
												>
													Max
												</Max>
											}

										/>
									</Form.Item>
									<Form.Item className="submit">
									{
										status !== 'CONNECTED'
										?  
											<Account.Button className="button"/>
										:
											<Button 
												size='large' 
												type="primary"
												className="button"
												htmlType="submit"
												
												>
													{toggle ? "Stake" : "Withdraw"}
											</Button>
									}	
									</Form.Item>
								</Form>
							</Col>
						</Row>
					</Panel>
				</Col>
			</Row>
		</div>
		)
	})
	`	
		.topbar{
			margin-bottom: 4.7rem;
			text-align: right;
		}

		h4{
			margin-top: 0!important;
		}

		.sPanel {
			max-width: 400px;
		}

		.buttons {
			padding-top: 1.5rem;
		}

		.button {
			margin: auto;
		}

		.submit {
			margin-top: 5rem;
			margin-bottom: 0;
			text-align: center;
		}
		
	`
