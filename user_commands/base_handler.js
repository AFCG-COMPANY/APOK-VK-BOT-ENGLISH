'use strict';

const
    regexp_commands = require('./utils/regexp_commands');

const
    start = require('./commands/start'),
    save_help = require('./commands/save_help'),
    getclasswork = require('./commands/get_classwork'),
    gethomework = require('./commands/get_homework'),
    sendhomework = require('./commands/send_homework');

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