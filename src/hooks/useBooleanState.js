import { useCallback, useState } from 'react'

export default function useBooleanState(initialState = false) {
	const [state, setState] = useState(initialState)
	const toggleState = useCallback(() => setState(state => !state), [])
	const setStateFalse = useCallback(() => setState(false), [])
	const setStateTrue = useCallback(() => setState(true), [])

	return [state, toggleState, setStateFalse, setStateTrue]
}
