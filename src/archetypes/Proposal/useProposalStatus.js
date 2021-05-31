import { useProposal } from 'libs/tracer'
import { upperFirst } from 'lodash'
import moment from 'moment'

const StatusType = { COUNTDOWN: 'countdown', VALUE: 'value' }

export default function useProposalStatus(id) {
	const { state, status, timestamps } = useProposal(id)

	switch (state) {
		case 'proposed':
			return {
				type: StatusType.COUNTDOWN,
				title: 'Starts in',
				value: moment.unix(timestamps?.open),
				className: `status-${status}`,
			}
		case 'open':
			return {
				type: StatusType.COUNTDOWN,
				title: 'Remaining',
				value: moment.unix(timestamps?.closed),
				className: `status-${status}`,
			}
		case 'processing':
			return {
				type: StatusType.VALUE,
				title: `${upperFirst(status === 'proposed' ? 'pending' : status)}`,
				value: moment.unix(timestamps?.closed).format('DD-MM-YYYY'),
				className: `status-${status}`,
			}
		case 'complete':
			return {
				type: StatusType.VALUE,
				title: `${upperFirst(status === 'proposed' ? 'complete' : status)}`,
				value: moment.unix(timestamps?.complete).format('DD-MM-YYYY'),
				className: `status-${status}`,
			}
		default:
			return null
	}
}
