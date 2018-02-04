# gw2map

Webapplication for World vs World in Guild Wars 2.

## Development environment setup

### Basic setup


Install node.
Clone project.

```sh
npm install
```

### Start local server

```sh
npm start
```

The server will listen on http://localhost:8000/  
The scripts will be automatically rebuilt on edit and tests are also run if present.

### Prepare a deployable build

```sh
npm build
```

All files needed to be deployed to a webserver will be put into the "dist" folder.
