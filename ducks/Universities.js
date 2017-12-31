import app, {toArray} from '../shared/Firebase';
import {StartRequest, FinishRequest} from './Request';

const UNIVERSITIES = "UNIVERSITIES";

let initialState = {
    universities: []
}

export const UniversitiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UNIVERSITIES:
            return Object.assign({}, state, {
                universities: action.data
            });
        default:
            break;
    }

    return state;
}

export const SetUniversities = (data)=> {
    return {
        type: UNIVERSITIES,
        data
    }
}

export const GetUniversities = () => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let universitiesRef = app.database().ref("/universities");
            universitiesRef.on("value", (snapshot)=> {
                dispatch(SetUniversities(toArray(snapshot.val())));
                resolve(toArray(snapshot.val()));
            });
        });
    }
}
