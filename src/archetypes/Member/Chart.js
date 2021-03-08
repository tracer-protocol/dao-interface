import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components'
import { DataLoader } from '@components'
import { KnownAddresses, useTopHolders, useTracer } from '@libs/tracer'
import Web3 from 'web3';

import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

const ChartContainer = styled.div
`
    height: 70vh;
    width: 50vw;
    margin: auto;
`

const Overlay = styled.div`
    position: absolute;
    background: #fff;
    opacity: 0.5;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
`

const RADIAN = Math.PI / 180;                    
const renderCustomizedLabel = (props) => {
    const { 
        cx, cy, midAngle, outerRadius, 
        percent, fill, payload, active
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
            <g>
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + (percent < 0.03 ? 5 : 0)} fontWeight={active ? '700': '400'} textAnchor={textAnchor} fill="#333">{`${payload.name ? payload.name : payload.address}`}</text>
                {percent > 0.03 ? // only show if its greater than 10% otherwise it will probably sit on top of another
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                        {`${payload.value} TCR (${(percent * 100).toFixed(2)}%)`}
                    </text>
                : ""}
            </g>
    );
};

const parseData = (topHolders, totalSupply) => {
    if (topHolders?.length && totalSupply) {
        let sum = 0;
        const data = topHolders.map((holding) => {
            const { id, balance } = holding;
            const parsed = parseFloat(Web3.utils.fromWei(balance));
            sum = sum + parsed;
            return ({
                address: id,
                name: KnownAddresses[id]?.name,
                value: parsed
            })
        })
        data.push(
            { 
                address: 'unknown',
                name: 'Other',
                description: "All other TCR DAO members. Each and every one of you is highly valued. Thankyou for maintaining such a great project.",
                value: parseFloat(Web3.utils.fromWei(totalSupply)) - sum
            }
        )
        return data
    } //else
    return [];
}


const InfoBox = styled(({ className, addressInfo, open, setOpen }) => {
    const { name, allocation, link, description } = addressInfo;
    return (
        <div className={className} datatype={open ? "OPEN" : "CLOSED"}>
            <div className="close" onClick={(e) => { e.preventDefault(); setOpen(false)}}>x</div>
            <h1 className="label">{name}</h1>
            <p>
                {`Allocation : ${allocation} TCR`}
            </p>
            <p>
                <a href={link?.href}>
                    {link?.name}
                </a>
            </p>
            <p dangerouslySetInnerHTML={{__html: description}} />
        </div>
    );
})
`
    background: #fff;
    padding: 1rem 3rem;
    box-shadow: 0 0rem 2rem 3rem rgba(0,0,0,0.02);
    border-radius: 5px;
    display: none;
    z-index: 5000;
    position: absolute;
    width: 50vw;
    &[datatype="OPEN"] {
        display: block;
    }

	a:hover {
		text-decoration: underline;
	}


    .close {
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 2rem;
        &:hover {
            cursor: pointer;
        }
    }
`

export default styled(
	({
		className
	}) => {

		const { topHolders, loading } = useTopHolders();
        const { totalSupply } = useTracer();
        const [activeIndex, setActiveIndex] = useState(null);
        const [open, setOpen] = useState(false);
        const addressRef = useRef("")

        const [addressInfo, setAddressInfo] = useState({
            address: "",
            name: "",
            description: "",
            allocation: "",
            link: {
                name: "",
                href: ""
            }
        })

        const data = parseData(topHolders, totalSupply || "1000000000000000000000000000")

        const COLORS = ['#0000bd', '#4848ED', '#5A7FFF', '#83ADFE', '#B8DDFF', '#C7EBFF'];

        const renderActiveShape = (props) => {
            const { 
                cx, cy, innerRadius, outerRadius, 
                startAngle, endAngle, fill, payload, addressRef
            } = props;

            const { address, value } = payload?.payload;
                
            const { name, description, link } = KnownAddresses[address] ? KnownAddresses[address] : {
                name: address,
                description: "Unknown address, if this is yours and you wish to label it, please reach out to the Lion's Mane team",
                link: null
            }

            if (addressRef.current !== address) {
                setAddressInfo({
                    name,
                    address,
                    description,
                    link,
                    allocation: value
                })
                addressRef.current = address;
            }

            return (
                    <g className="pointer" onClick={() => setOpen(true)}>
                        <defs>
                            <filter id="blur" x="0%"
                                y="0%" width="100%" height="100%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="4"/>
                            </filter>
                        </defs>
                        <Sector
                            cx={cx}
                            cy={cy}
                            innerRadius={innerRadius-5}
                            outerRadius={outerRadius}
                            startAngle={startAngle-2}
                            endAngle={endAngle+2}
                            fill={'#000'}
                            opacity={0.2}
                            filter="url(#blur)"
                        />
                        <Sector
                            cx={cx}
                            cy={cy}
                            innerRadius={innerRadius+5}
                            outerRadius={outerRadius+5}
                            startAngle={startAngle}
                            endAngle={endAngle}
                            fill={fill}
                        />
                        {renderCustomizedLabel({...props, active: true})}
                    </g>
            );
        }

		return <div 
			className={className}
			>
			<DataLoader
				loading={loading}
				noresults={topHolders?.length <= 0}
				>
                <ChartContainer>
                <InfoBox addressInfo={addressInfo} open={open} setOpen={setOpen}/>
                {activeIndex !== null ? <Overlay /> : ''}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={800} height={800}>
                        <Pie
                            dataKey="value"
                            activeIndex={activeIndex}
                            onMouseEnter={(_data, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            data={data}
                            innerRadius={'40%'}
                            outerRadius={'70%'}
                            activeShape={(props) => renderActiveShape({...props, addressRef})} 
                            label={renderCustomizedLabel}
                            paddingAngle={3}
                            isAnimationActive={false}
                        >
                            {
                                data.map((_entry, index) => 
                                    <Cell 
                                        fill={COLORS[index % COLORS.length]}
                                        opacity={activeIndex !== null && activeIndex !== index ? 0.5 : 1}
                                    />
                                )
                            }
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                </ChartContainer>
			</DataLoader>
		</div>
	})
	`	
		.topbar{
			margin-bottom: 4.7rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

        svg:not(:root) {
            overflow: visible;
        }

        .hover:hover {
            cursor: pointer;
        }

		.proposal-teaser + .proposal-teaser{
			margin-top: 1em
		}

        .pointer:hover {
            cursor: pointer;
        }
	`