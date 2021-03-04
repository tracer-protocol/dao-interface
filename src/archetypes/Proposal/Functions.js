import React, { useState } from 'react';
import styled from 'styled-components'
import { Form, Input, Select } from 'antd';

import { proposalFunctions } from './config'
import { useNetwork } from '../../libs/web3';

export default styled(
	({
		className, formRef
	}) => {
		const { contractAddresses } = useNetwork()
		const [fName, setFunction] = useState("setVestingSchedule");

		const handleChange = (fName) => {
			setFunction(fName);
			formRef.current.setFieldsValue({
				function_call: fName,
			});
		}

		const getInputComponent = (input) => {
			const { label, key, type } = input
			const defaultRules = [
				{
					required: true,
					message: `${label} is required`,
				}
			]
			switch(type) {
				case 'uint256': return (
					<Form.Item
						label={label}
						name={key}
						key={key}
						rules={[
							{
								required: true,
								message: `${label} is required`,
							}
						]}
					>
						<Input type="number"/>
					</Form.Item>
				)
				case 'address': return (
					
						<Form.Item
							label={label}
							name={key}
							key={key}
							rules={[
								...defaultRules,
							]}
						>
							<Input type="text"/>
						</Form.Item>
					)
				case 'currency': return (
						<Form.Item
							label={label}
							name={key}
							key={key}
							rules={[
								...defaultRules,
							]}
							>
								<Select 
									onChange={(value) => 
										formRef.current.setFieldsValue({
											currency: value,
										})
									}
									defaultValue={contractAddresses[input.default]}
								>
									{(input.options).map((currency) => 
										<Select.Option 
											value={contractAddresses[currency.key]} 
											key={contractAddresses[currency.key]}
										>
											{currency.ticker}
										</Select.Option>
									)}
								</Select>
						</Form.Item>
				)
				default: return (
					<Form.Item
							label={label}
							name={key}
							key={key}
							rules={[...defaultRules]}
						>
							<Input />
						</Form.Item>
				)
			}
		}
		
		return <div className={className}>
			<div>
				<Form.Item
					label="Function name" 
					extra="The name of the function that should be called"
					name="function_call"
					rules={[
						{
							required: true,
							message: 'Function call is required',
						},
					]}
					>
						<Select onChange={handleChange}>
							{Object.keys(proposalFunctions).map((func) => 
								<Select.Option value={func}>{func}</Select.Option>
							)}
						</Select>
				</Form.Item>
			</div>
			<div className="tight-pack">
				{proposalFunctions[fName]?.inputs.map((input) => 
					getInputComponent(input)
				)}
			</div>
		</div>
	})
	`	
		.tight-pack> .ant-row.ant-form-item {
			margin-bottom: 10px;
		}

		.tight-pack>  .ant-row.ant-form-item> .ant-col.ant-form-item-label {
			padding: 0;
		}

		.tight-pack>  .ant-row.ant-form-item> .ant-col.ant-form-item-label> label {
			height: auto!important;
		}
	`