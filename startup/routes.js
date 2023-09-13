const express= require('express');
const foodrouter = require('../routes/foodRoutes');
const drinkrouter = require('../routes/drinkRoutes');
const userRouter = require('../routes/userRoutes');
const errorHndler = require('../middleware/errorHandler');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/foods/', foodrouter);
    app.use('/api/drinks/', drinkrouter);
    app.use('/api/users/', userRouter);
    app.use(errorHndler);
}
