import app,{toArray} from '../shared/Firebase';
import {StartRequest, FinishRequest} from './Request';

const DEPARTMENTS = "DEPARTMENTS";

let initialState = {
    departments: []
}

export const DepartmentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case DEPARTMENTS:
            return Object.assign({}, state, {
                departments: action.data
            });
        default:
            break;
    }

    return state;
}

export const SetDepartments = (data)=> {
    return {
        type: DEPARTMENTS,
        data
    }
}

export const GetDepartments = () => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let departmentsRef = app.database().ref("/departments");
            departmentsRef.once("value", (snapshot)=> {
                dispatch(SetDepartments(toArray(snapshot.val())));
                resolve(snapshot.val());
            });
        });
    }
}

export const GetDepartmentsByFacultyId = (facultyId) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            let departmentsRef = app.database().ref("/departments").orderByChild("facultyId").equalTo(facultyId);        

            departmentsRef.once("value", (snapshot)=> {
                resolve(toArray(snapshot.val()));
            });
        });
    }
}