## D&D Beyond Dice and Discord Bot Integration

A Chrome Extension that listens for dice rolls on D&D Beyond Character Sheets (e.g. [Remigius](https://www.dndbeyond.com/profile/kamnikite/characters/23934295)) and posts the results into a Discord server via a bot.

The problem with current dice rolling bots like [Avrae](https://avrae.io/) is that they lack the thrill of physical dice. The problem with physical dice is that they lack the transparency of dice rolling bots because if you are playing a distributed game, no one else can see your dice roll. By using D&D Beyond's virtual dice and posting the result into a Discord server, the player gets the thrill of life-like virtual dice with the transparency of dice rolling bots.

## Local dev setup

First you'll need to get your dependencies sorted out. The following instructions assume that you have node and npm installed. I prefer installing and managing my node versions with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```
# tell nvm to use the version recommended in .nvmrc or install it if not found
nvm use

# install your dependencies
npm i

# more commands to come with react + es6 transpilation
```

After that all you need to do is tell Chrome where this new directory is on your PC.

-   In Chrome, navigate to `chrome://extensions/`
-   Enable "Developer mode"
-   Select "Load unpacked"
-   Select this directory in the Finder menu
