# Maze-Autoroute &#128739;
[![Coverage Status](https://coveralls.io/repos/github/ManuUseGitHub/Maze-Autoroute/badge.svg?branch=main)](https://coveralls.io/github/ManuUseGitHub/Maze-Autoroute?branch=main)

Mapping your routes by your routes folder structure

## Getting started


1. Create a `backend` folder, go into it and run these commands :
    ```bash
    $ npm init
    
    $ npm install maze-autoroute
    $ npm install express 
    ```

1. Create a `server.js` file which has the following code : 
    ```js
    const express = require('express');
    const autoroute = require("maze-autoroute");
    const app = express();

    // ROUTES ----------------------------------------------------------
    const onmatch = ({route,module}) => app.use(route, require(module));
    autoroute.getMapping({onmatch,verbose:true});
    // END ROUTES ------------------------------------------------------

    // Listening parameters
    app.listen(4000, () => {
        console.log("Ready on port: " + 4000);
    });
    ```
### Try it !

1. Create the `/backend/routes` folder structure.
1. Create two modules in `/backend/routes` : `Hello` and `fun/World`
    ```js
    // ---- In backend/routes/Hello/index.js ----

    const express = require("express");
    const router = express.Router();

    router.get('/', async (req, res) => {
        res.send("Hello world! The automatic router works!");
    })

    router.get('/submit-sign-in', async (req, res) => {
        res.send("You are magically signed in!");
    })

    module.exports = router;


    // ---- In backend/routes/fun/World/index.js ----

    const express = require("express");
    const router = express.Router();

    router.get('/', async (req, res) => {
        res.send("Don't waste your time on basic routing... Just saying.");
    })

    router.get('/how-r-u', async (req, res) => {
        res.send("Glad you asked! I am fine!");
    })

    module.exports = router;
    ```


### Feeling like using nodemon ?
1. Edit the `package.json` file obtained to add the server script
    ```js
    "scripts": {
        // ... other commands
        "server": "nodemon server.js"
     }
    ```


## Customer services demo
if you do prefer having a concrete example of the autorouter without creating a brand new project, I get you covered with a small demo project on GitHub. [Go check it](https://github.com/ManuUseGitHub/mz-express-autoroute-demo).

## Options
| Option       | default                                           | type            |
|--------------|---------------------------------------------------|-----------------|
| onmatch      | `match => {}`                                     | function        |
| onerr        | `({message}) => { console.log(message) }`         | function        |
| rootp        | `'routes/'`                           | string          |
| subr         | null                                              | misc            |
| translations | []                                                | array of object |
| verbose      | false                                              | true           |

***
#### `onmatch`
<small>onmatch : `on match`</small>
Function to pass to be apply on every route at the final process. That process iterates over simple objects containing the final route string (route) and the path to the module (module) relative to the given base folder path given by the <b>option</b> `rootp`.
```js
const onmatch = e => { 
    
    // destructured route item
    const { route, module } = e;
    
    express.use(route, require(module));
};
```
Sticking to this sniped is the better practice. Since the AutoRouter is calling `onmatch` anyway.
***
#### `onerr`
<small>onerr : `on error`</small>
Function to pass to handle exceptions that can very unlikely  happen during the auto routing. 
You may prefer to stick to the default value:
```js
const onerr = ({message}) => { console.log(message) }; // default value
```
***
#### `rootp`
<small>rootp : `root path`</small>
Defines the root folder to loop <b>recursively</b> to create the based route tree dynamically.
```js
const rootp = 'routes/'; // default value
```
**Note : the path should be relative to the server root level.**
***
#### `subr`
<small>subr : `sub route`</small>
Tells how to translate a route which is in a folder that points on a folder that is not a "leaf" in the folder tree part of `rootp`. 

**Note: Providing that special translation may avoid further eventual conflicts. Even routes work in the first place... prevention is the key!**

The value of subr can be either of these : 
```js
[ null | 'b64' | 'cptlz' | { after:'<something>', before:'<something>' } ]
```
use like this
```js
const subr = null ; // default value
```
**null case** : Take this following unchanged mapping. From the demo; `subr` is `null` by default:
```bash
AUTOROUTING: routes in 'routes/'
↪ [
  '/',                      #not a leaf !
  '/api',                   #not a leaf !
  '/api/customerservices',  #not a leaf !
  '/api/customerservices/cannotsee', #a leaf !
  ...,
  ]
```
**cptlz case** <small>`capitalize case`</small> : In this instance, the sub route will be capitalized ! `subr` is `cptlz` 

```bash
AUTOROUTING: routes in 'routes/'
↪ [
  '/', # nothing changed for the root ... (*)

  '/Api', # /api => /Api
  '/api/Customerservices', # /api/customServices => /api/CustomServices
  '/api/customerservices/cannotsee' # a leaf !
  ...,
]
```


**b64 case** : In this following mapping ; `subr` is `'b64'` :
```bash
AUTOROUTING: routes in 'routes/'
↪ [
  ...,
  '/api/customerservices/cannotsee',

  # it's /api/b64('customerservices') !
  '/api/Y3VzdG9tZXJzZXJ2aWNlcw==', 
  ...,
  # it's /b64('/') ! impossible to make a b64 of '' so it is b64('/')
  '/Lw==', 
  # it's /b64('api') !
  '/YXBp'
]
```
**{before:'Hi_',after:'_Bye'}** : In this following mapping ; `subr` is `{before:'Hi_',after:'_Bye'}` :
```bash
AUTOROUTING: routes in 'routes/'
↪ [
  ...,
  '/api/customerservices/cannotsee',# a leaf !
  '/api/Hi_customerservices_Bye',   # applied to /api/customerservices'
  '/Hi__Bye',                       # applied to /<empty string>
  '/Hi_api_Bye'                     # applied to /api
]
```
**Note : you don't have to set both `before` and `after` fields for the `subr` because these are applied if a value is set for either before or after or both fields as checked in the AutoRouter logic**
```js
if (this.subr && this.subr.before) { /*...*/ }
if (this.subr && this.subr.after) { /*...*/ }
```
***
#### `translations`
<small>`translations`</small>
Helps to customize routes in the final mapping. 
The Autoroute will iterate over the `translations` to see if a `from` fully matchs a route in the mapping and thus it will replace that matching route by the `to` string.
**Note : none of the `from` or the `to` should have trailing slashes `'/'`.**
For this instance, we may want to hide the infirm part of the route because it may hurt some feelings.
```js
const translations = [{ 
        from : 'api/customerservices/special/infirm/deaf', 

        // you can issue this route like this : http://localhost:4000/deaf ... that's all !
        to : 'deaf'
    },
    {
        from : 'api/customerservices/special/infirm/blind',

        // the infirm segment has been removed! 
        // And breaking news, blind has been replaced by 'cannotsee' ! ... because blind people can't see
        to : 'api/customerservices/cannotsee'
    },
    {
        from : 'api/customerservices/special/infirm/mute',

        // Maybe desabled is more suitable than infirm but we dont want to refactor this little mistake
        to : 'api/customerservices/desabled/mute'
    }
];
```
***
#### `verbose`
<small>`verbose`</small>
Tells if you want to see the final resulting route list. It has `false`. Turn this option to `true` to see a list of your auto mapped routes.
```js
const verbose = false; // default value
```

### Applying all options (example)
```js
// in server.js

// CONFIGURE options
const onerr = ({message}) => { console.log(message) }; // default value
const onmatch = ({route,module}) => express.use(route, require(module)); // most important
const rootp = 'routes/'; // default value
const subr = 'b64';
const translations = [{ 
    from : 'api/customerservices/special/infirm/deaf', to : 'deaf'
}];
const verbose = false; // default value

// APPLYING the mapping of routes with all options
autoroute.getMapping({onerr,onmatch,rootp,subr,translations,verbose});
```

# Licence
[MIT](https://github.com/ManuUseGitHub/Maze-Autoroute/blob/main/LICENSE)
