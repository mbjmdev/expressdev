import {Router} from "express";
import {query, validationResult, body, matchedData, checkSchema} from 'express-validator';
import {getUserValidationSchema, createUserValidationSchema} from '../utils/validationSchema.mjs';
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middleware.mjs";


const router = Router();

router.get('/api/users', 
    checkSchema(getUserValidationSchema),
    (req,res) => {

    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if(err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData);
    });
    
    const result = validationResult(req);
    if(!result.isEmpty()){
        res.status(400).send({errors: result.array()})
    }
    const {
        query: {filter,value}
    } = req;
    
    if (filter && value) 
        return res.send(
            //predicate function
            mockUsers.filter((user) => user[filter].includes(value))
        )

    return res.send(mockUsers);

});

router.post('/api/users', 
    checkSchema(createUserValidationSchema),
    (req,res) => {
        const result = validationResult(req);
        if(!result.isEmpty()){
           return res.status(400).send({errors: result.array()});
        }

    const data = matchedData(req);
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(mockUsers);
})

router.get('/api/users/:id', resolveIndexByUserId, (req,res) => {
    const {findUserIndex} = req;
    const findUser = mockUsers[findUserIndex]
    if(!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

router.put('/api/users/:id',resolveIndexByUserId, (req,res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = {id: parsedId, ...body}
    return res.sendStatus(200);
});


router.patch('/api/users/:id', resolveIndexByUserId, (req,res) => {
    const {body, findUserIndex} = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex],...body}
    return res.status(200).send('Ok');
});

router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    try {
        const {findUserIndex} = req;
        mockUsers.splice(findUserIndex, 1);
        return res.sendStatus(200);
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default router;