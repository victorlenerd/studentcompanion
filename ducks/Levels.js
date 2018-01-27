import app,{toArray} from '../shared/Firebase';
import {StartRequest, FinishRequest} from './Request';

const LEVELS = "LEVELS";

let initialState = {
    levels: []
}

export const LevelsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LEVELS:
            return Object.assign({}, state, {
                levels: action.data
            });
        default:
            break;
    }

    return state;
}

export const SetLevels = (data)=> {
    return {
        type: LEVELS,
        data
    }
}

export const GetLevels = () => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let levelsRef = app.database().ref("/levels");
            levelsRef.once("value", (snapshot)=> {
                dispatch(SetLevels(toArray(snapshot.val())));
                resolve(snapshot.val());
            });
        });
    }
}

export const GetLevelsByDepartmentId = (departmentId) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let levelsRef = app.database().ref("/levels").orderByChild("departmentId").equalTo(departmentId);     

            levelsRef.once("value", (snapshot)=> {
                resolve(toArray(snapshot.val()));
            });
        });
    }
}