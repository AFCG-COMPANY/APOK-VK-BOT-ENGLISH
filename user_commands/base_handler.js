'use strict';

const
    regexp_commands = require('./utils/regexp_commands');

const
    save_help = require('./utils/save_help');

const
    baseHandler = function(id, text, platform) {
        console.log(id, text, platform);
        if (regexp_commands.startRegexp.test(text)) {
            return;
        }

        if (regexp_commands.helpRegexp.test(text)) {
            console.log('help');
            save_help(id, text, platform);
            return;
        }

        if (regexp_commands.getclassworkRegexp.test(text)) {
            return;
        }

        if (regexp_commands.gethomeworkRegexp.test(text)) {
            return;
        }
        if (regexp_commands.sendhomeworkRegexp.test(text)){
           return;
        }

    }

exports.baseHandler = baseHandler;