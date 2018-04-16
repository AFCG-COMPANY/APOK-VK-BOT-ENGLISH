import * as CONST from '../../config/constants'

export function check_user_answer(userAnswer: any, rightAnswer: Array<any>, systemType: string): any {

    var answer = {};
    if (systemType == CONST.TELEGRAM){
        userAnswer = userAnswer.split('<br>');
        console.log('ua', userAnswer);
        console.log('ra', rightAnswer);
        var rightAnswers: number = 0;
        for (let i = 0; i < userAnswer.length; i++) {
            if(userAnswer[i] == rightAnswer[i]) {
                rightAnswers++;
            }
        }
        console.log(rightAnswers);
        if(rightAnswers > rightAnswer.length * 0.5) {
            answer['decided'] = true;
        }
        else{
            answer['decided'] = false;
        }
        console.log(answer);
        return answer;
    }

}