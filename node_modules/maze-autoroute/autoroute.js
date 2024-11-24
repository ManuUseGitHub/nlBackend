//V1.0.3

const fs = require('fs');
const path = require('path');
const b64 = require('btoa');
const { optionize, stick } = require("modulopt");
const autorouteOptions = require("./options.js")


const flatten = (lists) => {
    return lists.reduce((a, b) => a.concat(b), []);
}

const mappRouteWithModule = (routes, pat) => {
    return routes.map(r => {
        return {
            route: path.normalize(
                '/' + r.replace(pat, '').toLowerCase()
            ),
            module: path.normalize(r)
        }
    });
}

module.exports = class Autoroute {
    options = {}
    // PUBLIC -------------------------------------------------------------
    getMapping = (options) => {

        this.applyOptions(options);

        try {
            this.checkMappingPossible();

            let mapping = this.createMapping()

            // replace specific routes by custom
            this.translateRoutes(mapping);

            // sorting by route alphabetically
            mapping = mapping.sort((a, b) => a.route.localeCompare(b.route));

            this.flattenMapping(mapping);

            // display available routes
            this.hintMapping(mapping);
            this.linkCallBacks(mapping);

            // return the mapping for further use
            return mapping;
        } catch (err) { this.options.onerr(err); }
    }

    // PRIVATE ------------------------------------------------------------
    applyOptions(options = {}) {
        if (options.rootp != undefined) {
            let rootp = options.rootp;

            // all empty-string '/' or '\' become './'
            rootp = /^(?:(?:)|\/|\\)$/.test(rootp) ? "./" : rootp;
            options.rootp = (path.normalize(process.cwd() + "/" + rootp));
        }

        stick(optionize(this, autorouteOptions.data), options);
    }

    flattenMapping = (mapping) => {
        if(this.options.flat){
            mapping.forEach(r => {
                r.route = "/" + this.getSubRouteGroup(r.route).leaf
            })
        }
    }

    linkCallBacks = (mapping) => {
        mapping.forEach(e => this.options.onmatch(e));
    }

    createMapping = () => {
        const directories = this.getDirectoriesRecursive(this.options.rootp);
        const routes = this.collectRoutes(directories)

        // the mapping is entries of the providen route + module path to require
        return this.replaceSubRoutes(
            mappRouteWithModule(routes, this.options.rootp)
        );
    }

    collectRoutes = (directories) => {
        return directories
            .map(p => path.normalize(p))

            // only get the folders with a module of a router
            .filter(p => this.isRouterModule(p));
    }

    checkMappingPossible = () => {
        const rootp = this.options.rootp;
        if (!fs.existsSync(rootp)) {

            throw {
                message: `\nAUTOROUTING: No direcrory matched the following root path '${rootp}' for the autoroute.` +
                    `\nTo set the root folder for the autoroute to work on , give a custom path via the option rootp like this :\n{'rootp':'<path-to-routers>'}\n`
            }
        }
    }

    capitalize = (r) => {
        const { route } = r;
        const g = this.getSubRouteGroup(route);

        if (g.leaf.length > 0) {
            r.route = `${g.branches}${g.leaf.charAt(0).toUpperCase() + g.leaf.slice(1)}`;
        }
    }

    setBase64SubRoute = ({ mapping, i, route }) => {
        const m = /^(\/?(?:[^\/]+\/)*)([^\/]*)$/.exec(route);
        const sub = m[2] ? m[2] : m[1]
        mapping[i].route = (m[1] + b64(sub))
            .replace(/[=]+$/, "");
    }

    getSubRouteGroup = (route) => {
        /// [Hello/world/.../][genius]
        const m = /(?<branches>(?:\/.*\/?)?\/)(?<leaf>[^\/]*)$/
            .exec(route)

        return m ? m.groups : { branches: "", leaf: "" }
    }

    frameRoute = (r) => {
        const { route } = r;
        const g = this.getSubRouteGroup(route);

        this.preframeRoute(r, g);
        this.postframeRoute(r);
    }

    preframeRoute = (r, g) => {
        const before = this.options.frame.before;
        if (before) {
            r.route = `${g.branches}${before + g.leaf}`
        }
    }

    postframeRoute = (r) => {
        const after = this.options.frame.after;
        if (after) {
            r.route += after;
        }
    }

    replaceSubRoutes = (mapping) => {
        const result = mapping
            .sort((a, b) => a.route.localeCompare(b.route))
            .map((routeModule, i) => {
                this.substituteRootModules(mapping, routeModule, i)
                return routeModule;
            });
        return result;
    }

    substituteRootModules = (mapping, routeModule, i) => {

        const next = i < (mapping.length - 1) ? mapping[i + 1].route : "?";
        const isSub = RegExp(`(${path.normalize(routeModule.route)}\/?).*`)
            .test(next);

        if (isSub && this.options.subr != null) {
            this.substituteAmbiguous(mapping, routeModule, i)
        }
    }

    substituteAmbiguous = (mapping, routeModule, i) => {
        if (routeModule.route === "/")
            return
        this.substituteWithFrame(routeModule);
        this.substituteWithCapital(routeModule)
        this.substituteWithBase64(routeModule, mapping, i)
    }

    substituteWithCapital = (routeModule) => {
        if (this.options.subr == "cptlz") {
            this.capitalize(routeModule);
        }
    }

    substituteWithFrame = (routeModule) => {
        if (this.options.subr == "obj") {
            this.frameRoute(routeModule);
        }
    }

    substituteWithBase64 = (routeModule, mapping, i) => {
        if (this.options.subr == "b64") {
            this.setBase64SubRoute({ mapping, i, route: routeModule.route });
        }
    }

    translateRoutes = (mapping) => {
        mapping.map(({ route }, i) => {
            this.options.translations.forEach(
                translate => this.applyTranslation(mapping, translate, route, i)
            );
        })
    }

    applyTranslation = (mapping, translate, route, i) => {
        if (("/" + translate.from) == route) {
            mapping[i].route = "/" + translate.to;
            return;
        }
    }

    getDirectories = (srcpath) => {
        return fs.readdirSync(srcpath)
            .map(file => path.join(srcpath, file))
            .filter(p => !/.*node_modules.*/.test(p)) // remove every node_modules based folder of the result
            .filter(p => fs.statSync(p).isDirectory());
    }

    isRouterModule = (dirPath) => {
        const hasIndexFile = fs.existsSync(dirPath + "/index.js");

        if (hasIndexFile) {
            const module = require(path.normalize(dirPath));

            return (
                typeof (module) == "function" &&
                module.name == "router"
            );
        }
        return false;
    }

    getDirectoriesRecursive = (srcpath) => {

        return [srcpath, ...flatten(this.getDirectories(srcpath)
            .map(this.getDirectoriesRecursive)
        )
        ];
    }

    hintMapping = (mapping) => {
        if (this.options.verbose) {
            console.log(`\nAUTOROUTING: routers in '${this.options.rootp}'`)
            console.log("\u21AA", mapping.map(e => e.route))
            console.log("To turn this message off, use the Autoroute with the option 'verbose:false'", "\n")
        }
    }
}