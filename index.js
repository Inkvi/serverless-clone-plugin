'use strict';
const _ = require('lodash');

class ServerlessClonePlugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

        this.hooks = {
            'before:package:initialize': this.deployHook.bind(this),
            'before:invoke:invoke': this.deployHook.bind(this),
            'before:logs:logs': this.deployHook.bind(this),
            'before:metrics:metrics': this.deployHook.bind(this)
        };
    }

    deployHook() {
        const allFunctions = this.serverless.service.functions;
        for (let funcName in this.serverless.service.functions) {
            let func = allFunctions[funcName];

            let clone = func.clone;
            if (!_.isInteger(clone) || clone < 2) {
                continue;
            }

            for (let i in _.range(clone)) {
                const newFuncConfig = _.clone(func);
                newFuncConfig['name'] += "-" + i;

                let data = {"functions": {}};
                data['functions'][(funcName + "-" + i)] = newFuncConfig;

                this.serverless.service.update(data)

            }

            // delete the original name so only numbers are used
            delete allFunctions[funcName];
        }
    }
}

module.exports = ServerlessClonePlugin;
