'use strict';

const
    regexp_commands = require('./utils/regexp_commands');

const
    start = require('./utils/start'),
    save_help = require('./utils/save_help'),
    getclasswork = require('./utils/getclasswork'),
    gethomework = require('./utils/gethomework'),
    sendhomework = require('./utils/sendhomework');

const
    baseHandler = function(id, text, platform) {
        if (regexp_commands.startRegexp.test(text)) {
            return start(id, text, platform);
        }

        if (regexp_commands.helpRegexp.test(text)) {
            console.log('help');
            return save_help(id, text, platform);
        }

        if (regexp_commands.getclassworkRegexp.test(text)) {
            return getclasswork(id, text, platform);
        }

        if (regexp_commands.gethomeworkRegexp.test(text)) {
            return gethomework(id, text, platform);
        }
        if (regexp_commands.sendhomeworkRegexp.test(text)){
           return sendhomework(id, text, platform);
        }

    }

exports.baseHandler = baseHandler;