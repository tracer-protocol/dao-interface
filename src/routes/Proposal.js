import React from 'react';
import { useParams } from "react-router-dom";
import { Proposal } from '@archetypes'

export default props => {
	const { id } = useParams()
	return <Proposal.Detail id={id}/>
}