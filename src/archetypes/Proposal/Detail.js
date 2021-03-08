import React from 'react';
import { Link, useParams } from "react-router-dom";
import styled from 'styled-components'
import { Typography, Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Address, Panel, Skeleton } from '@components'
import { useProposal } from '@libs/tracer'
import { proposalFunctions } from '@archetypes/Proposal/config'
import Proposal from './'

import DOMPurify from 'dompurify';
import { useFileStorage } from '../../libs/tracer';

const CleanHTML = styled(({ className, html }) => {
	var clean = DOMPurify.sanitize(html);
	return <Typography className={className} dangerouslySetInnerHTML={{
		__html: clean
	}} />
})
`
	h1, h2, h3 {
		color: #0000bd;
	}
	h2 {
		font-size: 2rem!important;
		font-weight: 600!important;
		padding-top: 2rem!important;
		padding-bottom: 0!important;
		margin: 2rem 0important;
	}
	h3 {
		font-size: 1.9rem;
	}
	p {
		margin: 1rem 0!important;
	}

`

export default styled(
	({
		className
	}) => {
		let { id } = useParams();
		const ipfsData =  useProposal(id);
		const { title, summary, text, creator } = ipfsData

		return <div 
			className={className}
			>
			<Link className='back' to='/'>
				<ArrowLeftOutlined/>&nbsp; 
				Proposals
			</Link>
			<Row 
				gutter={24}
				>
				<Col 
					span={14}
					>
					<Panel>
						<Typography.Title>
							<Skeleton title>
								{title}
							</Skeleton>
						</Typography.Title>
						<Address 
							address={creator}
						/>
						
						<div className="summary">
							<Typography.Title 
								level={2}
								>
								<Skeleton active lines={3}>
									{summary}
								</Skeleton>
							</Typography.Title>

							<Proposal.FunctionDetail ipfsData={ipfsData} />
						</div>
						
						<p>
							<Skeleton active lines={10}>
								<CleanHTML html={text}/>
							</Skeleton>
						</p>
					</Panel>
				</Col>
				<Col 
					span={10}
					>
					<Panel>
						<Proposal.Status.Panel 
							id={id}
						/>
					</Panel>
				</Col>
			</Row>
		</div>
	})
	`	
		>.back{
			font-size: 1.8rem;
			
		}

		>.ant-row{
			margin-top: 2.9rem;
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
			padding-bottom: 1rem;
			margin-bottom: 2rem;
			position: relative;
			line-height: 1.3em;

		}
		.summary {
			position: relative;
			padding-bottom: 3rem;
			margin-bottom: 3rem;
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