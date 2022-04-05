const mongoose = require("mongoose")

const connectDatabase = () => {
    mongoose.connect(process.env.MongoDB_URI)
    .then(
        data => console.log(`Succesfully connected with MongoDB Host: ${data.connection.host}`)
    )
    // no need to handle error here
    // .catch(
    //     err => console.log(err)
    // )
}

module.exports = connectDatabase