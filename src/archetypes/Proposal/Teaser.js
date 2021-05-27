import { truncateString } from 'util/helpers'

import { StarFilled } from '@ant-design/icons'
import { Typography } from 'antd'
import Skeleton from 'components/Skeleton'
import { useProposal } from 'libs/tracer'
import { useAccount } from 'libs/web3'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Status from './Status'

export default styled(({ id, className }) => {
	const { title, creator } = useProposal(id)
	const { address } = useAccount()

	return (
		<Link className={`proposal-teaser ${className}`} to={`/proposal/${id}`}>
			<span className="left">
				<div className="tag">
					<Status.State id={id} />
				</div>

				<div className="copy">
					<Typography.Title level={1} ellipsis className="title">
						<Skeleton>{title}</Skeleton>
					</Typography.Title>
					<Typography.Text disabled className="address">
						Submitted by: {truncateString(creator)}
						{creator?.toLowerCase() === address?.toLowerCase() && <StarFilled />}
					</Typography.Text>
				</div>
			</span>
			<span className="right">
				<Status.VotingWidget id={id} compact />
				<Status.Info id={id} />
			</span>
		</Link>
	)
})`
	padding: 1.7rem 1.2em;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	background: var(--color-popover-background);
	box-shadow: 0 0 rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease-in-out;

	> .left,
	> .right {
		display: flex;
		align-items: center;
		max-width: 50%;
		overflow: hidden;
	}

	> .left {
		width: 45%;

		.tag {
			min-width: 15.5rem;
			text-align: center;
			margin-right: 1rem;
		}

		.copy {
			width: calc(100% - 16.5rem);
		}

		.title {
			margin: 0;
			margin-right: 1em;
			font-size: 1.8rem;
			font-weight: normal;
			margin-bottom: 0.6rem;
			width: 100%;
		}

		.address {
			.anticon-star {
				color: var(--color-gold);
				margin-left: 0.2em;
			}
		}
	}

	> .right {
		width: 55%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		text-align: right;

		.ant-tag {
			min-width: 90px;
			text-align: center;
		}

		> * {
			margin: 0 0 0 1rem;
		}

		.proposal-status-info {
			min-width: 10rem;
		}
	}

	&:hover {
		background: var(--color-popover-lighter-background);
		box-shadow: 0.2rem 0.4rem 1rem rgba(0, 0, 0, 0.05);
		transform: translateY(-1px);
	}
`
