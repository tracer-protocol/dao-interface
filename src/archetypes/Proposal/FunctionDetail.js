import { proposalFunctions } from './config';
import styled from 'styled-components';
import Skeleton from 'components/Skeleton';
import { Typography } from 'antd';

export default styled(
	({
		ipfsData, className
	}) => {

        const functionDetails = proposalFunctions[ipfsData?.function_call];

        if (!functionDetails) {
            return <></>
        }

        return (
            <Typography.Paragraph className={className}>
                <p>
                    <Skeleton lines={1}>
                        Function Call: {ipfsData?.function_call}
                    </Skeleton> 
                </p>
                <ul>
                    Inputs:
                    {functionDetails?.inputs.map((input) => 
                        <li>

                            <Skeleton lines={1}>
                                {`${input.key}: ${ipfsData[input.key]}`}
                            </Skeleton>
                        </li>
                    )}
                </ul>
            </Typography.Paragraph>
        )
    })
    `
        p{
            font-size: 1.6rem;
            margin-bottom: 0.5rem;
        }
        ul{
            font-size: 1.6rem;
        }
    `