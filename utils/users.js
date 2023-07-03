const users =[]

// join user to chat
function userJoin(id, username , room){
    const user = {id , username, room}

    users.push(user)

    return user;
}

// get current user  : many user in a single room
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

// User left the chat
// return  that user : 0th index
function userLeft(id){
    const index = users.findIndex(user => user.id===id)
    
    if(index !== -1 ){
        return users.splice(index,1)[0];  // del and ret
    }
}

// get room users
// filter many
// find 1

function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeft,
    getRoomUsers
}