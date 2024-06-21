import { Router } from "express";

const router = Router();

router.get('/api/products',(req,res) => {
    res.send([
        {id: 123, name: 'Chicken', price: 100}
    ])
});

export default router;