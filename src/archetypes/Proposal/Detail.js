import { ArrowLeftOutlined } from '@ant-design/icons'
import { useProposal } from '@libs/tracer'
import { Typography } from 'antd'
import Address from 'components/Address'
import BackToTopButton from 'components/BackToTopButton'
import Panel from 'components/Panel'
import Skeleton from 'components/Skeleton'
import DOMPurify from 'dompurify'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

import ProposalFunctionDetail from './FunctionDetail'
import StatusPanel from './StatusPanel'

const CleanHTML = styled(({ className, html }) => {
	const ref = useRef(null)
	const __html = useMemo(() => DOMPurify.sanitize(html), [html])

	useLayoutEffect(() => {
		if (!ref.current) return

		Array.from(ref.current.querySelectorAll('table')).forEach(table => {
			const outerContainer = document.createElement('div')
			outerContainer.className = 'table-outer-container'

			const innerContainer = document.createElement('div')
			innerContainer.className = 'table-inner-container'

			innerContainer.addEventListener(
				'scroll',
				event => {
					if (event.currentTarget.scrollLeft > 80) return outerContainer.classList.add('scrolled')
					outerContainer.classList.remove('scrolled')
				},
				{ passive: true }
			)

			table.parentNode.insertBefore(outerContainer, table)
			outerContainer.appendChild(innerContainer)
			innerContainer.appendChild(table)
		})
	}, [__html])

	return <Typography className={className} ref={ref} dangerouslySetInnerHTML={{ __html }} />
})`
	h1,
	h2,
	h3 {
		color: var(--color-primary);
	}
	h2 {
		font-size: 2rem !important;
		font-weight: 600 !important;
		padding-top: 2rem !important;
		padding-bottom: 0 !important;
		margin: 2rem 0important;
	}
	h3 {
		font-size: 1.9rem;
	}
	p {
		margin: 1rem 0 !important;
	}

	table thead tr {
		border-bottom: 1px solid #dfdffe;
	}
	tr {
		border-bottom: 1px solid #dfdffe;
	}
	table {
		margin-top: 5vh;
	}
	td,
	th {
		padding-left: 10px;
		padding-right: 10px;
	}

	table thead tr th {
		font-weight: 600;
		color: var(--color-primary);
	}

	hr {
	}

	@media screen and (max-width: 960px) {
		table {
			width: 900px;
		}

		.table-outer-container {
			position: relative;

			&:after {
				content: '> Scroll to see table';
				padding: 2rem;
				position: absolute;
				top: 12rem;
				right: 0;
				border-top-left-radius: 9999999rem;
				border-bottom-left-radius: 9999999rem;
				color: var(--color-light);
				background: var(--color-primary);
				pointer-events: none;
				transition: opacity 450ms ease;
				opacity: 1;
			}
			&.scrolled:after {
				opacity: 0;
			}
		}
		.table-inner-container {
			overflow-x: auto;
		}
	}
`

export default styled(({ className }) => {
	let { id } = useParams()
	const ipfsData = useProposal(id)
	const { title, summary, text, creator } = ipfsData

	return (
		<div className={className}>
			<Link className="back" to="/">
				<ArrowLeftOutlined />
				&nbsp; Proposals
			</Link>
			<Panel transparent>
				<Typography.Title>
					<Skeleton title>{title}</Skeleton>
				</Typography.Title>
				<Address address={creator} />

				<div className="summary">
					<Typography.Title level={2}>
						<Skeleton active lines={3}>
							{summary}
						</Skeleton>
					</Typography.Title>

					<ProposalFunctionDetail ipfsData={ipfsData} />
				</div>

				<p>
					<Skeleton active lines={10}>
						<CleanHTML html={text} />
					</Skeleton>
				</p>
			</Panel>
			<Panel>
				<StatusPanel id={id} />
			</Panel>
			<BackToTopButton />
		</div>
	)
})`
	display: grid;
	grid-template: auto auto / 14fr 10fr;
	grid-gap: 2.4rem;
	grid-template-areas:
		'a a'
		'b c';

	@media screen and (max-width: 960px) {
		grid-template: auto / auto;
		grid-template-areas:
			'a'
			'b'
			'c';
	}

	> *:nth-child(3) {
		align-self: start;
	}

	> .back {
		grid-area: a;
		font-size: 1.8rem;
	}

	> .ant-row {
		margin-top: 2.9rem;
	}

	h1 {
		font-size: 3.6rem;
		font-weight: normal;
		margin-bottom: 0.7em;
	}

	.address {
		margin-bottom: 4.7rem;
	}

	h2 {
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
		&:after {
			content: '';
			position: absolute;
			top: 100%;
			left: 32%;
			width: 36%;
			border-bottom: 1px solid var(--color-border-base);
		}
	}

	p {
		font-size: 1.6rem;
		line-height: 1.25em;
	}
`
