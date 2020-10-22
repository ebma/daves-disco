# Daves Disco

Dave is a Discord bot focused on music playback.
The project consists of two different parts: a Node.js backend and a React-based web frontend.

## Frontend application

You can find the source code in the <a href="/web">web</a> sub-directory.

### Technologies / Frameworks

<p align="center">
    <p>
    <a href="https://nodejs.org/">
        <img
        alt="Node.js"
        src="https://nodejs.org/static/images/logo-light.svg"
        width="150"
        />
    </a>
    <a href="http://expressjs.com/">
        <img
        alt="Node.js"
        src="https://i.cloudup.com/zfY6lL7eFa-3000x3000.png"]
        width="250"
        />
    </a>
    </p>
    <p>
    <a href="https://discord.js.org">
      <img src="https://discord.js.org/static/logo.svg" width="300" alt="discord.js" style="margin-right:32px;" />
    </a>
    <a href="https://discord-akairo.github.io">
      <img src="https://discord-akairo.github.io/static/logo.svg" width="250" alt="discord-akairo" />
    </a>
  </p>
    <p>
    <a href="https://material-ui.com/" rel="noopener" target="_blank">
        <img width="120" src="https://material-ui.com/static/logo.svg" alt="Material-UI logo" style="margin-right:32px;">
    </a>
    <a href='http://redux.js.org'>
        <img src='https://camo.githubusercontent.com/f28b5bc7822f1b7bb28a96d8d09e7d79169248fc/687474703a2f2f692e696d6775722e636f6d2f4a65567164514d2e706e67' height='60' alt='Redux Logo' aria-label='redux.js.org'/>
    </a>
    </p> 
</p>

Global state is handled by `redux`. This project uses the <a href="https://redux-toolkit.js.org/">redux-toolkit</a> package to simplify the setup process.

## Backend application

The node server runs the discord bot and offers a RESTful API for communication.

### Technologies

The RESTful API is realised with the <a href="https://expressjs.com/">Express</a> framework.

<a href="https://github.com/discord-akairo/discord-akairo">discord-akairo</a> offers easier setup and some convenience methods regarding the discord bot programming.

## Communication between frontend / backend application

The applications communicate on two different channels: a <a href="https://socket.io/">Socket.IO</a> connection and `http` requests.

A websocket is used to notify on updates (e.g. volume changes, queue changes, play/pause state) where only small chunks of data are sent over the network.

For logging in, requesting the player-state, available tracks and playlists or accessing the youtube API `http` requests are used.

### Login flow

1. Select guild and user in web app
2. Dave will send you a DM on Discord where you reply with `yes`
3. You go back to the web app and can now access all pages for your guild (e.g. music and soundboard area)

During authentication a `JWT` token is created so that the application is able to communicate with the backend.
Afterwards a `Socket.io` connection authenticated with that token is established (using <a href="https://github.com/auth0-community/auth0-socketio-jwt">socketio-jwt</a>)and `http` requests to the REST API are secured by including the token in the `Authorization` header.
