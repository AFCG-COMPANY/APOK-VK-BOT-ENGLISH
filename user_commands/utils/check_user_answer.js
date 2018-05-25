'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
var CONST = require("../../config/constants");
function check_user_answer(userAnswer, rightAnswer, systemType) {
    var answer = {};
    if (systemType == CONST.TELEGRAM) {
        userAnswer = userAnswer.split('<br>');
        console.log('ua', userAnswer);
        console.log('ra', rightAnswer);
        var rightAnswers = 0;
        for (var i = 0; i < userAnswer.length; i++) {
            if (userAnswer[i] == rightAnswer[i]) {
                rightAnswers++;
            }
        }
        console.log(rightAnswers);
        if (rightAnswers > rightAnswer.length * 0.5) {
            answer['decided'] = true;
        }
        else {
            answer['decided'] = false;
        }
        console.log(answer);
        return answer;
    }
}
exports.check_user_answer = check_user_answer;
