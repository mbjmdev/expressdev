import express, { request } from 'express';
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import {mockUsers} from "./utils/constants.mjs"

const app = express();

app.use(express.json());
app.use(cookieParser('helloworld'));
app.use(
    session({
        secret: 'anson the dev',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        }
    })
);

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port  ${PORT}`);
});

app.get('/', (req,res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie('hello','world',{maxAge: 60000 * 60 * 2, signed: true});
    res.status(201).send('Nothing here');
});

app.post('/api/auth',(req,res) => {
    const {body: {username,password}} = req;
    const findUser = mockUsers.find((user) => user.username == username);
    if(!findUser || findUser.password !== password){
        res.status(401).send({msg: "user not found"});
    } 
    req.session.user = findUser;
    res.status(201).send({msg: "User Authenticated",user: findUser});
});

app.get('/api/auth/status',(req,res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
    });
    return req.session.user 
        ? res.status(201).send({msg: "User logged in", user: req.session.user})
        : res.status(401).send({msg: "User not logged in"});
});

app.post("/api/cart", (req,res) => {
    if(!req.session.user) return res.sendStatus(401);

    const {body:item} = req;
    const {cart} = req.session;
    if(cart){
        cart.push(item);
    }else {
        req.session.cart = [item]; 
    }

    return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
    if(!req.session.user) return res.sendStatus;
    return res.send(req.session.cart ?? []);
})