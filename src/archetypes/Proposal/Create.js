import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components'
import { Form, Input, Row, Col, Typography, Modal } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Account } from '@archetypes'
import { Button, Panel } from '@components'
import { useDao, useTracer } from '@libs/tracer'
import { useAccount } from '@libs/web3'
import { fromWei } from '@util/helpers'
import Proposal from './'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


export default styled(
	({
		className
	}) => {

		const { propose, proposalThreshold, userStaked, __STAKE } = useDao();
		const { userBalance } = useTracer();
		const { status } = useAccount();
		const [editor, setEditor] = useState();
		const [showModal, setShowModal] = useState(true);
		const formRef = React.createRef();

		return <div 
			className={className}
			>
				
			<Modal title="Warning" visible={showModal} onCancel={() => setShowModal(false)} footer={null}>
				<p>This feature is still in beta. Create proposals at your own risk. There is potential that the generated proposal may result in a reverted transaction.</p>
			</Modal>
			<Link className='back' to='/'>
				<ArrowLeftOutlined/>&nbsp; 
				Proposals
			</Link>
			<Form
				layout="vertical"
				size={'large'}
				onFinish={(values) => {
					const data = editor.getData();
					values['text'] = data;
					propose(values)
				}}
				requiredMark={false}
				ref={formRef}
				initialValues={{ // initialise to vesting schedule proposal
					function_call: 'setVestingSchedule'
				}}
				>
				<Row 
					gutter={24}
					>
					<Col 
						span={14}
						>
						<Panel>
							<Typography.Title 
								level={1}
								>
								Create New Proposal
							</Typography.Title>


							<Form.Item 
								label="Title" 
								extra="Give your proposal a descriptive title"
								name="title"
								rules={[
									{
										required: true,
										message: 'Title is required',
									},
								]}
								>
								<Input />
							</Form.Item>
							<Form.Item 
								label="Summary" 
								extra="An informative summary helps people to understand what your proposal is about"
								name="summary"
								rules={[
									{
										required: true,
										message: 'Summary is required',
									},
								]}
								>
								<Input />
							</Form.Item>
							<Form.Item 
								label="Proposal Text" 
								extra="Clearly and succinctly outline your proposal here"
								name="text"
								rules={[
									{
										required: true,
										message: 'Summary is required',
									},
								]}
								>	
									<CKEditor
										editor={ ClassicEditor }
										config={{
											toolbar: [ 'heading', 'bold', 'italic', 'link', 'undo', 'redo', 'numberedList', 'bulletedList', 'insertTable']
										}}
										data="<p></p>"
										onReady={ editor => setEditor(editor) }
									/>
							</Form.Item>
						</Panel>
					</Col>
					<Col 
						span={10}
						>
						<Panel className="reduce-pad top">
							<Proposal.Functions formRef={formRef}/>
						</Panel>

						<Panel className="reduce-pad">
							<Form.Item 
								label="Link to Discourse Post"
								extra='Link your proposal to the relevant discussion in discourse'
								name="discourse_url"
								>
								<Input placeholder='https://'/>
							</Form.Item>

							<Form.Item>
								{
									status === 'CONNECTED' &&
									userStaked < proposalThreshold &&
										<Button 
											disabled={true}
											>
											{fromWei(proposalThreshold)} Staked token required to propose
										</Button>
								}

								{
									status === 'CONNECTED' &&
									parseInt(fromWei(userBalance)) >= 1 &&
									!userStaked &&
										<Button 
											type="primary"
											onClick={__STAKE}
											>
											Stake
										</Button>
								}

								{
									status === 'CONNECTED' &&
									userStaked >= proposalThreshold &&
										<Button 
											type={'primary'} 
											htmlType="submit"
											>
											Submit proposal
										</Button>	
								}

								{
									status !== 'CONNECTED' && <Account.Button/>
								}
							</Form.Item>
						</Panel>
					</Col>
				</Row>
			</Form>
		</div>
	})
	`	
		>.back{
			font-size: 1.8rem;
			color: var(--color-primary);
		}

		>.ant-form{
			margin-top: 2.9rem;
		}

		.ck-editor__editable {
			height: 20rem;
		}

		.reduce-pad {
			padding: 2rem 4rem;
		}

		.reduce-pad.top {
			margin-bottom: 1rem;
		}
		
		h1{
			font-size: 3.6rem;
			font-weight: normal;
			margin-bottom: 0.7em;
		}

		.address{
			margin-bottom: 4.7rem;
		}

		h2{
			font-size: 1.8rem;
			font-weight: normal;
			padding-bottom: 5.1rem;
			margin-bottom: 3.3rem;
			position: relative;
			line-height: 1.3em;

			&:after{
				content: '';
				position: absolute;
				top: 100%;
				left: 32%;
				width: 36%;
				border-bottom: 1px solid black;
			}
		}

		p{
			font-size: 1.8rem;
			line-height: 1.25em;
		}
	`