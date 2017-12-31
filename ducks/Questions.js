import {
    NetInfo,
    AsyncStorage
} from 'react-native';

const QUESTIONS = 'QUESTIONS';
const SET_CURRENT_QUESTION = 'SET_CURRENT_QUESTION';
import { StartRequest, FinishRequest } from '../ducks/Request';
import app, { toArray } from '../shared/Firebase';

let initialState = {
    currentQuestion: {},
    questions: []
}

export const SetQuestions = ( questions )=> {
  return {
    type: QUESTIONS,
    questions
  };
}

export const GetQuestions = (paperId)=> {
    return (dispatch)=> {
        dispatch(StartRequest());
        return new Promise((resolve, reject)=> {
            let questionsRef = app.database().ref("/questions").equalTo(paperId).orderByChild("paperId");
            questionsRef.on("value", (snapshot)=> {
                dispatch(SetQuestions(toArray(snapshot.val())));
                dispatch(FinishRequest());
                resolve();
            });
        });
    }
}

export const GetQuestionsOffline = (courseId, paperId)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(`@UPQ:OFFLINE_QUESTIONS:ID_${courseId}`)
            .then((saved_questions)=> {
                if (saved_questions !== null) {
                    let questions = JSON.parse(saved_questions);
                    dispatch(SetQuestions(questions.filter((question)=> {
                        if (question.paperId == paperId) return question;
                    })));
                    resolve(JSON.parse(saved_questions));
                } else {
                    resolve([]);
                }
            })
            .catch((err)=> {
                reject(err);
            });
        });
    }
}

export const SaveQuestionsOffline = (courseId)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let questionsRef = app.database().ref("/questions").equalTo(courseId).orderByChild("courseId");
            questionsRef.on("value", (snapshot)=> {
                let questions =  JSON.stringify(toArray(snapshot.val()));
                AsyncStorage.setItem(`@UPQ:OFFLINE_QUESTIONS:ID_${courseId}`, questions)
                .then(()=> {
                    resolve(questions);
                })
                .catch((err)=> {
                    reject(err);
                });
            });
        });
    }
}

export const SetCurrentQuestion = ( question )=> {
  return {
    type: SET_CURRENT_QUESTION,
    question
  };
}

export const QuestionsReducer = (state = initialState, action)=> {

    switch (action.type) {
        case QUESTIONS:
            return Object.assign({}, state, {
                questions: action.questions
            });
        case SET_CURRENT_QUESTION:
            return Object.assign({}, state, {
                currentQuestion: action.question
            });
        default:
            break;
    }

    return state;
}
