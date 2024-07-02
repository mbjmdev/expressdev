import { Router } from "express";

const router = Router();

router.get('/api/products',(req,res) => {
    //console.log(req.header.cookies);
    //console.log(req.signedCookies);
    if(req.signedCookies.hello && req.signedCookies.hello == 'world')
        return res.send([
            {id: 123, name: 'Chicken', price: 100}
        ]);
    return res.send({msg: "Sorry you need the correct cookie"});
});

export default router;