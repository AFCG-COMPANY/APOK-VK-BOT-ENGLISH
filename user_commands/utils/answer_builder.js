const
    emoji = require('node-emoji')

class AnswerBuilder {
    constructor(id, answer, platform){
        this.id = id;
        this.answer = answer;
        this.platform = platform;
    }

    getHelpAnswer() {
        return 21;
    }

    getErrorAnswer() {
        return ''.concat(
            'Похоже, что что-то пошло не так ',
            emoji.get('upside_down_face'),
            ' \n',
            'Попробуйте чуть позже ',
            emoji.get('face_with_thermometer')
        )
    }


}

module.exports.AnswerBuilder;