'use strict';

const
    regexp_commands = require('./utils/regexp_commands');

const
    start = require('./commands/start'),
    saveHelp = require('./commands/save_help'),
    getClasswork = require('./commands/get_classwork'),
    getHomework = require('./commands/get_homework'),
    sendHomework = require('./commands/send_homework');

const
    baseHandler = function(id, text, platform) {
        if (regexp_commands.startRegexp.test(text)) {
            return start(id, text, platform);
        }

        if (regexp_commands.helpRegexp.test(text)) {
            console.log('help');
            return saveHelp(id, text, platform);
        }

        if (regexp_commands.getclassworkRegexp.test(text)) {
            return getClasswork(id, text, platform);
        }

        if (regexp_commands.gethomeworkRegexp.test(text)) {
            return getHomework(id, text, platform);
        }
        if (regexp_commands.sendhomeworkRegexp.test(text)){
           return sendHomework(id, text, platform);
        }

    }

exports.baseHandler = baseHandler;