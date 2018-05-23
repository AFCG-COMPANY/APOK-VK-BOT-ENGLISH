'use strict';

const
    regexp_commands = require('./utils/regexp_commands');

const
    save_help = require('./utils/save_help');

const
    baseHandler = function(id, text, platform){
        switch (text){
            case regexp_commands.startRegexp:
                break;
            case regexp_commands.helpRegexp:
                save_help(id, text, platform);
                break
            case regexp_commands.getclassworkRegexp:
                break
            case regexp_commands.gethomeworkRegexp:
                break
            case regexp_commands.sendhomeworkRegexp:
                break
            default:
                break
        }
    }

exports.baseHandler = baseHandler;