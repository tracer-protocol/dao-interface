# Tracer
https://tracer.finance

This repository contains the dao interface code. It allows users to create and vote on proposals, view proposals, view token allocations, stake and withdraw tokens and view all governors staking their tokens

For more on the Tracer protocol and the Tracer DAO, view the DAO's [Twitter](https://twitter.com/tracer_finance), join the [Discord](https://discord.gg/kvJEwfvyrW) and check out the [Discourse](https://discourse.tracer.finance/)

##### Contributions guide
## Install

```
npm install or yarn
```

## Running Locally
The codebase is not dependent any environment variables. 

Contract configuration is handled in /src/App.Config.js, where on network change the new configuration will be initialised.
To run locally
```
npm run start or yarn start
```

## Deployment
Deployments will be made automatically on merge to master. To simulate deployment locally run
```
npm run build or yarn build
```

and test the production build at

```
npx serve ./build
```

or any other static file serving tool.


# Development Notes
There are still a few things that arent ideal in terms of development.
### Text to Proposal Mapping
Initially there was no proposalUri stored in the contracts. This required an external DB mapping between proposals and their information. This will soon be replaced in favour of snapshot integration.

### Distributions Pie Chart
Since this is a display of known token allocations, you must manually enter in the descriptions of each of the parties respectively.
This mapping can be found at /src/libs/tracer/dao.addresses.json. To add an address to this list simply create a new entry into that mapping by following a previous example.

Currently the query only fetchers the top 4 holders, so you'll also need to update /src/libs/tracer/members.js to fetch more top holders depending on how many we want to display. 

Finally, src/archetypes/Member/Chart.js has a fixed list of colours used for each top holder, so you may need to append additional colours. 


# Credit
The contents of this repository were largely contributed by the elastic Midnight Swami and the individuals at [Flexdapps](https://flexdapps.com/).