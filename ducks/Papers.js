import {
    NetInfo,
    AsyncStorage
} from 'react-native';

const PAPERS = 'PAPERS';
const SET_CURRENT_PAPER = 'SET_CURRENT_PAPER';

import app, { toArray } from '../shared/Firebase';
import {StartRequest, FinishRequest} from './Request';

let initialState = {
    currentPaper: {},
    papers: []
}

export const SetPapers = ( papers )=> {
  return {
    type: PAPERS,
    papers
  };
}

export const GetPapers = (courseId)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let papersRef = app.database().ref("/papers").equalTo(courseId).orderByChild("courseId");
            papersRef.on("value", (snapshot)=> {
                dispatch(SetPapers(toArray(snapshot.val())));
                resolve(toArray(snapshot.val()));
            });
        });
    }
}

export const GetPapersOffline = (courseId)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(`@UPQ:OFFLINE_PAPERS:ID_${courseId}`)
            .then((saved_courses)=> {
                if (saved_courses !== null) {
                    dispatch(SetPapers(JSON.parse(saved_courses)));
                    resolve(JSON.parse(saved_courses)); 
                } else {
                    resolve([]);
                }
            })
        });
    }
}

export const SavePapersOffline = (courseId, papers)=> {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            AsyncStorage.setItem(`@UPQ:OFFLINE_PAPERS:ID_${courseId}`, JSON.stringify(papers))
            .then(()=> {
                resolve(papers);
            })
            .catch((err)=> {
                reject(err);
            });
        });
    }
}

export const SetCurrentPaper = ( paper )=> {
  return {
    type: SET_CURRENT_PAPER,
    paper
  };
}

export const PapersReducer = (state = initialState, action)=> {

    switch (action.type) {
        case PAPERS:
            return Object.assign({}, state, {
                papers: action.papers
            });
        case SET_CURRENT_PAPER:
            return Object.assign({}, state, {
                currentPaper: action.paper
            });
        default:
            break;
    }

    return state;
}
