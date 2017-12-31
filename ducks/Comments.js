import app, { toArray } from '../shared/Firebase'; 

export const GetComments = (type, typeId) => {
  return (dispatch)=> {
      return new Promise((resolve, reject)=> {
        let typeCommentsRef = app.database().ref('comments/').equalTo(typeId).orderByChild(`${type}Id`);
        typeCommentsRef.on("value", (snapshot)=> {
            let comments = toArray(snapshot.val());
            resolve(comments);
        }, (err)=>{
            reject(err);
        });
      });
  };
}

export const PostComments = (comment) => {
  return (dispatch)=> {
      return new Promise((resolve, reject)=> {
        var commentsRef = app.database().ref('comments/');
        commentsRef.push(comment)
        .then(()=> {
            resolve(comment);
        })
        .catch(err=>{
            reject(err) 
        });

    });
  };
}
