import { truncateString } from 'util/helpers'

import { CloseOutlined } from '@ant-design/icons'
import DataLoader from 'components/DataLoader'
import { AnimatePresence, motion } from 'framer-motion'
import { KnownAddresses, useTopHolders, useTracer } from 'libs/tracer'
import { forwardRef, useCallback, useRef, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'
import styled, { css } from 'styled-components'
import Web3 from 'web3'

const RADIAN = Math.PI / 180
const COLORS = ['#0E38CF', '#3DA8F5', '#3D73F5', '#2954F0', '#01227F', '#0D0F55']

export default styled(({ className }) => {
	const { topHolders, loading } = useTopHolders()
	const { totalSupply } = useTracer()
	const [activeIndex, setActiveIndex] = useState(null)
	const [open, setOpen] = useState(false)
	const close = useCallback(() => {
		setActiveIndex(null)
		setOpen(false)
	}, [])
	const addressRef = useRef('')

	const [addressInfo, setAddressInfo] = useState({
		address: '',
		name: '',
		description: '',
		allocation: '',
		link: {
			name: '',
			href: '',
		},
	})

	const data = parseData(topHolders, totalSupply || '1000000000000000000000000000')

	return (
		<div className={className}>
			<DataLoader loading={loading} noresults={topHolders?.length <= 0}>
				<ChartContainer>
					<AnimatePresence>
						{open && (
							<InfoBox
								key={addressInfo.address}
								addressInfo={addressInfo}
								close={close}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							/>
						)}
					</AnimatePresence>
					<ResponsiveContainer width="100%">
						<PieChart>
							<Pie
								dataKey="value"
								activeIndex={activeIndex}
								onMouseEnter={(_data, index) => setActiveIndex(index)}
								onMouseLeave={() => setActiveIndex(null)}
								onTouchStart={(_data, index) => setActiveIndex(index)}
								data={data}
								activeShape={props => (
									<ActiveShape {...props} addressRef={addressRef} setAddressInfo={setAddressInfo} setOpen={setOpen} />
								)}
								label={CustomizedLabel}
								isAnimationActive={false}
							>
								{data.map((_entry, index) => (
									<Cell
										fill={COLORS[index % COLORS.length]}
										stroke="none"
										opacity={activeIndex !== null && activeIndex !== index ? 0.5 : 1}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>
				<MobileLabelsBox data={data} activeIndex={activeIndex} setActiveIndex={setActiveIndex} setOpen={setOpen} />
			</DataLoader>
		</div>
	)
})`
	.pointer {
		cursor: pointer;
	}
	g,
	path {
		transition: all 450ms ease;
	}
`

const ChartContainer = styled.div`
	position: relative;
	width: 100%;
	height: 60rem;
	margin: auto;

	@media screen and (max-width: 960px) {
		.chart-label,
		.recharts-pie-label-line {
			display: none;
		}
	}
`

const ActiveShape = props => {
	const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props
	const { addressRef, setAddressInfo, setOpen } = props

	const { address, value } = payload?.payload

	const { name, description, link } = KnownAddresses[address] || {
		name: address,
		description: "Unknown address, if this is yours and you wish to label it, please reach out to the Lion's Mane team",
		link: null,
	}

	if (addressRef.current !== address) {
		setAddressInfo({
			name,
			address,
			description,
			link,
			allocation: value,
		})
		addressRef.current = address
	}

	return (
		<g className="pointer" onClick={() => setOpen(true)}>
			<defs>
				<filter id="blur" x="0%" y="0%" width="100%" height="100%">
					<feGaussianBlur in="SourceGraphic" stdDeviation="4" />
				</filter>
			</defs>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle - 2}
				endAngle={endAngle + 2}
				fill={'#000'}
				opacity={0.2}
				filter="url(#blur)"
			/>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			{<CustomizedLabel {...props} active />}
		</g>
	)
}

const CustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, fill, payload, active }) => {
	const sin = Math.sin(-RADIAN * midAngle)
	const cos = Math.cos(-RADIAN * midAngle)
	const sx = cx + (outerRadius + 10) * cos
	const sy = cy + (outerRadius + 10) * sin
	const mx = cx + (outerRadius + 30) * cos
	const my = cy + (outerRadius + 30) * sin
	const ex = mx + (cos >= 0 ? 1 : -1) * 22
	const ey = my
	const textAnchor = cos >= 0 ? 'start' : 'end'

	return (
		<g className="chart-label">
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey + (percent < 0.03 ? 5 : 0)}
				fontWeight={active ? '700' : '400'}
				textAnchor={textAnchor}
				fill="var(--color-light)"
			>{`${payload.name || truncateString(payload.address)}`}</text>
			{percent > 0.03 && ( // only show if its greater than 10% otherwise it will probably sit on top of another
				<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="var(--color-primary)">
					{`${payload.value} TCR (${(percent * 100).toFixed(2)}%)`}
				</text>
			)}
		</g>
	)
}

const MobileLabelsBox = styled(({ className, data, activeIndex, setActiveIndex, setOpen }) => {
	const sum = data.reduce((sum, holder) => sum + holder.value, 0)

	return (
		<div className={className}>
			{data.map((entry, index) => (
				<div
					className={['label', activeIndex === index && 'active'].filter(Boolean).join(' ')}
					onClick={() => {
						setActiveIndex(index)
						setOpen(true)
					}}
				>
					<div className="name">{entry.name || truncateString(entry.address)}</div>
					<div className="value">
						{entry.value} TCR ({((entry.value / sum) * 100).toFixed(2)}%)
					</div>
					<div className="color" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
				</div>
			))}
		</div>
	)
})`
	display: none;

	> .label {
		display: grid;
		grid-template: auto auto / auto 1fr auto;
		grid-template-areas:
			'name . color'
			'value . color';
		align-items: center;
		margin: 1rem 0;
		transition: all 450ms ease;
		cursor: pointer;

		${props =>
			props.activeIndex !== null &&
			css`
				opacity: 0.6;
			`}

		&.active {
			opacity: 1;
		}

		> .name {
			grid-area: name;
			color: var(--color-light);
			font-size: 1.3em;
		}
		> .value {
			grid-area: value;
			color: var(--color-primary);
		}
		> .color {
			grid-area: color;
			width: 3rem;
			height: 3rem;
			border: 0.15rem solid var(--color-light);
			border-radius: 9999999999999rem;
		}
	}

	@media screen and (max-width: 960px) {
		display: block;
	}
`

const InfoBox = motion(styled(
	forwardRef(({ addressInfo, close, ...props }, ref) => {
		const { name, allocation, link, description } = addressInfo

		return (
			<div ref={ref} {...props}>
				<div className="close" onClick={close}>
					<CloseOutlined />
				</div>
				<h1 className="label">{name}</h1>
				<p>{`Allocation : ${allocation} TCR`}</p>
				<p>
					<a href={link?.href}>{link?.name}</a>
				</p>
				<p dangerouslySetInnerHTML={{ __html: description }} />
			</div>
		)
	})
)`
	display: block;
	position: absolute;
	top: 0;
	left: 50%;
	width: 80rem;
	padding: 1rem 3rem;
	border-radius: 5px;
	background: var(--color-popover-background);
	box-shadow: 0 0rem 2rem 3rem rgba(0, 0, 0, 0.02);
	transform: translateX(-50%);
	z-index: 500;

	a:hover {
		text-decoration: underline;
	}

	.close {
		position: absolute;
		top: 1em;
		right: 1em;
		cursor: pointer;
	}

	@media screen and (max-width: 960px) {
		left: 0;
		width: 100%;
		transform: none;
	}
`)

const parseData = (topHolders, totalSupply) => {
	if (!topHolders?.length) return []
	if (!totalSupply) return []

	const data = topHolders
		// parse balance to a float
		.map(({ id, balance }) => ({ id, balance: parseFloat(Web3.utils.fromWei(balance)) }))
		// look up holder names by address (id)
		.map(({ id, balance }) => ({ address: id, name: KnownAddresses[id]?.name, value: balance }))

	// calculate sum of top holder balances
	const sum = data.reduce((sum, holder) => sum + holder.value, 0)

	data.push({
		address: 'unknown',
		name: 'Other',
		description:
			'All other TCR DAO members. Each and every one of you is highly valued. Thankyou for maintaining such a great project.',
		value: parseFloat(Web3.utils.fromWei(totalSupply)) - sum,
	})

	return data
}
