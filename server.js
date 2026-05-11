const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').default
const userRoutes = require('./routes/userRoutes')
const cors = require('cors');

const app = express();
dotenv.config();
app.use(express.json());
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin : `${process.env.BASE_URL}`,
    credentials : true
}));

mongoose.connect(process.env.MONGO_URL).
then(() =>{
    console.log('MongoDB connected Successful')
})
app.use(session({

    secret : "this is secrete",
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({
        mongoUrl : process.env.MONGO_URL,
        collectionName : "mySession"
    }),
     cookie: {
        secure: true,        
        httpOnly: true,
        sameSite: "none"  
    }
}))
app.use('/food', express.static(path.join(__dirname, 'dist')));

app.use('/food/api', userRoutes);
const PORT = process.env.PORT || 3000;
app.get('/food/dashboard', (req, res)=>{
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get(['/','/food'], (req, res) => {
    res.render('signin');
});

app.listen(PORT, ()=> {
    console.log(`server is started at port ${PORT}`)
})