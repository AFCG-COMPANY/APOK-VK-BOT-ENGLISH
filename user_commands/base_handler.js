const save_help = require('./utils/save_help');

const  baseHandler = function(id, text, platform){
    switch (text){
        case /\/start*./:
            break;
        case /\/help*./:
            save_help(id, text, platform);
            break
        case /\/getclasswork*./:
            break
        case /\/gethomework*./:
            break
        case /\/sendhomework*./:
            break
        default:
            break
    }
}
exports.baseHandler = baseHandler;