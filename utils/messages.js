const moment = require('moment')

function formatMessage(username , text){
    return {
        username, 
        text,
        time : moment().format('h:mm a')
    }
}

module.exports = formatMessage


// pass object instead of a single text
// name , text , time(dont need to pass as a parameter)