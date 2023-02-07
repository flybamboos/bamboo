const express  = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express();
const port = 3000;

app.use(cookieParser());
// app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));

const {useRouter} = require('./router')

useRouter(app)

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})