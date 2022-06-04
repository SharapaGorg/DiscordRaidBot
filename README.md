# Project structure

```
Raid
│   README.md
│   main.js
|   utils.js
|   .gitignore
│
└───genData
│   │   animeShit.json
│   │   dotaShit.json    
│       
│   
└───raidData
    │   TOKENS.json
    │   BOTS.json
    |   RAIDED_GUILDS.json
```

## Folders

### The __genData__ directory

*Folder with parsed data created to make channel/role/user/etc titles*

### The __raidData__ directory

*Folder with info about bots/(raid victims)*

## Files

__main.js__ - launch bots according to data from __raidData__

__utils.js__ - additional tools used in __main.js__ during 

__raidData__/__TOKENS.json__ - list of your bots` tokens

__raidData__/__BOTS.json__ - list of your bots` id (each your bot ignores all you other bots)

__raidData__/__RAIDED_GUILDS.json__ - list of raided guilds (neccessary to CLI raid control)

## Install dependencies

```
yarn install
```

**or**

```
npm install
```

## Fast start

Steps:

- Install dependencies using __yarn__/__npm__/smth else
- Fill __raidData__ to set up launch 
- Execute following command
```
node main.js
```

## Raid commands

- __help__ - _show list of commands_
- __createChannels__ *amount* - create (amount * bots amount) channels with titles from __genData__
- __createRoles__ *amount* - create (amount * bots amount) roles with titles from __genData__
- __deleteChannels__ - delete **all** channel in guild/server excepting channel with name **root**
- __deleteRoles__ - delete **all** roles in guild/server
