import React, { useState } from 'react';
import styled from 'styled-components'
import { Form, Input, Select } from 'antd';

import { proposalFunctions } from './config'

export default styled(
	({
		className, formRef
	}) => {

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
								{
									pattern: new RegExp("^0x[a-fA-F0-9]{40}$"),
									message: "Please enter a valid ethereum address"
								},
							]}
						>
							<Input type="text"/>
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