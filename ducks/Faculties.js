import app, {toArray} from '../shared/Firebase';
import {StartRequest, FinishRequest} from './Request';

const FACULTIES = "FACULTIES";

let initialState = {
    faculties: []
}

export const FacultiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FACULTIES:
            return Object.assign({}, state, {
                faculties: action.data
            });
        default:
            break;
    }

    return state;
}

export const SetFaculties = (data)=> {
    return {
        type: FACULTIES,
        data
    }
}

export const GetFaculties = () => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let facultiesRef = app.database().ref("/faculties");
            facultiesRef.once("value", (snapshot)=> {
                dispatch(SetFaculties(toArray(snapshot.val())));
                resolve(snapshot.val());
            });
        });
    }
}


export const GetFacultiesByUniversityId = (universityId) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let facultiesRef = app.database().ref("/faculties").orderByChild("universityId").equalTo(universityId);        

            facultiesRef.once("value", (snapshot)=> {
                resolve(toArray(snapshot.val()));
            });
        });
    }
}