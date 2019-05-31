# Watch Together

Watch Together provides synchronized video playback for online watch parties by propagating video playback control over websocket.

To see Watch Together in action, visit https://watch-together-beta.herokuapp.com/.

## Task List

- [ ] Use proper logging in `server.js`
- [ ] Kick idle sockets (e.g. sockets that have been inactive for 5 hours)
- [ ] Limit socket connections based on IP
- [ ] Enforce hard cap on the number of concurrent socket connections
- [ ] UI Improvements (open to suggestions)

## Development

To set up Watch Together for local development, clone this repostiory and make sure you have npm installed.

In the project root directory, run

```
npm install
```

to install linting and formatting tools. This step is optional but recommended.

Then, in both `src/client` and `src/server`, run

```
npm install
```

to install client and server dependencies.

Finally, in `src/client`, run

```
npm run build-dev
```

and in `src/server`, run

```
npm start
```

to build the JavaScript bundle and start the backend server.

You can now use Watch Together at http://localhost:3000/, and any code change should trigger a reload.
