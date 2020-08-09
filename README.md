# Daves Disco

Dave is a Discord bot focused on music playback.
The project consists of two different parts: a Node.js backend and a React-based web frontend.

## Frontend application

You can find the source code in the <a href="/web">web</a> sub-directory.

### Technologies

The <a href="https://material-ui.com/">Material-UI</a> component library is used for styling the application UI.

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

In the login view of the frontend application the user has to select a guild and member with which he wants to login.
Upon selecting a member the discord bot will send a message to this particular member on discord to ensure that he is indeed trying to login. Thus only people having access to the discord account of a member can login to that account.
Once the user accepted the login request a `JWT` token containing IDs of the selected guild and member is created and send to the frontend application which then stores it in localstorage.
With the `JWT` token, the application is now able to communicate with the backend.
A `Socket.io` connection authenticated with that token (using <a href="https://github.com/auth0-community/auth0-socketio-jwt">socketio-jwt</a>) can be established and `http` requests to the REST API are secured by including the token in the `Authorization` header.
