import mongoose from "mongoose";

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(process.env.MONGODB_URL, connectionParams)
    .then(() => console.log('Connected!'))
    .catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });

