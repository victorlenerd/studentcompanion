import {
    AsyncStorage
} from 'react-native';

export const GetReminders = ( reminder ) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem("@UPQ:REMINDERS")
            .then(( stored_reminders )=> {
                let reminders = [];
                if (stored_reminders !== null) reminders = JSON.parse(stored_reminders);
                resolve(reminders);
            })
            .catch((err)=> {
                reject(err.mesage);
            });
        });
    }
}

export const DeleteReminder = (index) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            dispatch(GetReminders())
            .then((reminders)=> {
                reminders.splice(index, 1);
                AsyncStorage.setItem("@UPQ:REMINDERS", JSON.stringify(reminders))
                .then(()=> {
                    resolve(reminders);
                })
                .catch((err)=> {
                    reject(err.mesage);
                });
            });       
        });
    }
}

export const AddReminder = ( reminder ) => {
    return (dispatch)=> {
        return new Promise((resolve, reject)=> {
            dispatch(GetReminders())
            .then((reminders)=> {  
                reminders.push(reminder);
                AsyncStorage.setItem("@UPQ:REMINDERS", JSON.stringify(reminders))
                .then(()=> {
                    resolve(reminders);
                })
                .catch((err)=> {
                    reject(err.mesage);
                });
            });
        });
    }
}