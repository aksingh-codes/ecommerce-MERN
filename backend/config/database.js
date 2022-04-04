const mongoose = require("mongoose")

const connectDatabase = () => {
    mongoose.connect(process.env.MongoDB_URI)
    .then(
        data => console.log(`Succesfully connected with MongoDB Host: ${data.connection.host}`)
    ).catch(
        err => console.log(err)
    )
}

module.exports = connectDatabase