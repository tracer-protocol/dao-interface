import React, { useState, useMemo } from 'react';
import styled from 'styled-components'
import DataLoader from 'components/DataLoader'
import { useMembers } from '@libs/tracer'
import Teaser from './Teaser'
import { Menu, Dropdown, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';



const StyledDropdown = styled(Dropdown)	
`	
	background: #fff;
	color: #0000bd;
	padding: 10px;
	border-radius: 3px;
	right: 0;
`

const DropdownContainer = styled.div
`
	width: 100%;
	text-align: right;
	margin: 20px 0;
`

export default styled(
	({
		className
	}) => {
		const { members, loading } = useMembers()
		const [sort, setSort] = useState(0)

		const map = {
			0: "Total Staked",
			1: "Proposals Raised",
			2: "Votes Cast"
		}

		const sortedMembers = useMemo(() => {
			if (members?.length) {
				switch (sort) {
					case 0: 
						return members.slice().sort((m1, m2) => m2.staked - m1.staked)
					// case 1: 
					// 	return members.slice().sort((m1, m2) => m2.votes.length - m1.votes.length)
					case 2: 
						return members.slice().sort((m1, m2) => m2.votes.length - m1.votes.length)
					default: return members;
				}
			} else {
				return members
			}

		}, [members, sort])


		const menu = (
			<Menu onClick={(e) => setSort(parseInt(e.key))}>
				<Menu.Item key={0}>
					<Typography>
						Tokens Staked
					</Typography>
				</Menu.Item>
				{/* <Menu.Item key="1">
					<Typography>
						Proposals Raised
					</Typography>
				</Menu.Item> */}
				<Menu.Item key={2}>
					<Typography>
						Votes Cast
					</Typography>
				</Menu.Item>
			</Menu>
		);

		return <div 
			className={className}
			>
			<DataLoader
				loading={loading}
				noresults={members?.length <= 0}
				>
				<DropdownContainer>
					<StyledDropdown overlay={menu} trigger={['click']}>
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
							Sort by: {map[sort]} <DownOutlined />
						</a>
					</StyledDropdown>
				</DropdownContainer>
				{sortedMembers.map(member => <Teaser key={member.id} {...member}/>)}
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

		.proposal-teaser + .proposal-teaser{
			margin-top: 1em
		}
	`
