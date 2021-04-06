import { useEffect, createContext, useContext, useState } from "react";
import { useAccount, useNetwork, useTransactions } from '@libs/web3';
import { ethers } from "ethers";
import { AIRDROP_ABI } from './_config'

// given a list of leaves, generates the proof data needed
//data is an array of [account, amount] tuples
//data is an array of [account, amount] tuples
const generateMerkle = (data, ethersInstance) => {
  let tree = [];

  let leaves = data.map((x) =>
    ethersInstance.utils.solidityKeccak256(["address", "uint256"], [x[0], x[1]])
  );

  tree.push(leaves);

  // loop until we have one node left
  while (leaves.length > 1) {
    let level = [];
    // for each current leaf, compute parents
    for (let i = 0; i < leaves.length; i += 2) {
      let leftChild = leaves[i];
      let rightChild;
      //If we have an odd number of nodes, just use this leaf again
      if (i == leaves.length - 1) {
        rightChild = leaves[i];
      } else {
        rightChild = leaves[i + 1];
      }

      //compute hash
      let currHash;
      if (parseInt(leftChild, 16) > parseInt(rightChild, 16)) {
        currHash = ethersInstance.utils.solidityKeccak256(
          ["bytes32", "bytes32"],
          [leftChild, rightChild]
        );
      } else {
        currHash = ethersInstance.utils.solidityKeccak256(
          ["bytes32", "bytes32"],
          [rightChild, leftChild]
        );
      }
      level.push(currHash);
    }
    tree.push(level);
    leaves = level;
  }
  return tree;
};


const Context = createContext({});

const useContract = () => useContext(Context);

const Provider = 
	({
		children
	}) => {
		let { contractAddresses, web3 } = useNetwork()
		let { address } = useAccount();
        const { createTransaction } = useTransactions()
		let [contract, setContract] = useState();
        const [leaves, setLeaves] = useState([]);
        const [claimed, setClaimed] = useState(false);

		useEffect(() => {
			if(contractAddresses?.tracerDao && web3){
				const _contract = new web3.eth.Contract(AIRDROP_ABI, contractAddresses?.airdropContract)
				setContract(_contract)
			}
		}, [contractAddresses?.airdropContract]) // eslint-disable-line
        
        useEffect(() => {
            let unmounted = false;
            const fetchLeaves = async () => {
                const res = await fetch ('https://ipfs.io/ipfs/QmSNYGH7G4JPYFMU83og7snss16Dq3uwb2D21FgPpVNdbF')
                    .then((res) => res.json())
                    // .then((res) => res.
                    .catch((err) => { console.error(err); return ({ error: err })})

                if (res.error) {
                    console.error("Failed to fetch leaves from ipfs")
                    return;
                }
                if (!unmounted) {
                    setLeaves(accounts)
                }
            }
            fetchLeaves()
            return () => { unmounted = true };
        }, [])


		const fetchClaimed = async () => {
            try {
                const claimed = await contract.methods.claimed(address).call()
                setClaimed(claimed)
            } catch (err) {
                console.error(`Failed to check if user has claimed: ${claimed}`)
            }
		}

		useEffect(() => contract  && address && fetchClaimed(), [contract, address]) // eslint-disable-line

        const withdraw = async (proof, amount) => {
			if(!address || !contract) {
				console.debug('Address or Contract not defined')
			} else {
				const tx = createTransaction(contract, 'withdraw')
				tx.params = [proof, amount]
				tx.attemptMessage = 'Claiming token drop'
				tx.successMessage = 'Claim successful'
				tx.failureMessage = 'Failed to claim'
				await tx.send({from: address});

                fetchClaimed();
			}
        }

        const generateProof = () => {
            let matchingLeaf;
            for (var i = 0; i < leaves.length; i++) {
                if (leaves[i][0].toLowerCase() === address.toLowerCase()) {
                    matchingLeaf = {
                        entryData: leaves[i],
                        index: i,
                    };
                    //assumption: single address does not appear more than once
                    break;
                }
            }
            if (matchingLeaf === undefined) {
                return { error: "Not in proof" };
            }

            // we now have our leafs starting index. Generate an array of entries
            // start at the base of the tree and at index i
            let currentId = matchingLeaf.index;
            let tree = generateMerkle(leaves, ethers);

            //for each level, find the corresponding entry needed and add to our array
            let proofData = [];
            tree.forEach((level) => {
                //@ts-ignore
                if (level.length != 1) {
                    //skip the root
                    //get the pair id for the current element
                    let pairId = currentId % 2 === 0 ? currentId + 1 : currentId - 1;
                    //this happens when we are at the last id in the level (eg currentId + 1 does not exist)
                    //this CANT happen when currentId - 1 doesn't exist as that implies currentId = 0, however 0 % 2 = true therefor you would be in a + 1 state. Contradiction
                    if (level[pairId] === undefined) {
                        // simply use yourself as in the merkle generation
                        pairId = currentId
                    }
                    proofData.push(level[pairId]);
                    // move to the next level and reset our id
                    currentId = Math.floor(currentId / 2);
                }
            });

            return { proofData, amount: matchingLeaf.entryData[1] };
        }

		return <Context.Provider 
			value={{
				// expose more methods here to interact with the contract
                generateProof,
                withdraw,
                claimed
			}}
			>
			{children}
		</Context.Provider>
	};

export default {
	Provider,
	useContract
}