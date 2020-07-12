require("dotenv").config();
const axios = require("axios");
var search_util = require('../utils/search_util');
var express = require('express');
var router = express.Router();



router.get('/query/:searchQuery/amount/:num', (req, res) => {
    const { searchQuery, num} = req.params;

    let adas = parseInt(num);

    //set params : 
    search_params = [];
    search_params.query = searchQuery;
    search_params.number = parseInt(num);
    search_params.instructionsRequired = true;
    // check if optional params exists & add them: 
    search_util.checkParamsForQuery(req,search_params);

    search_util
        .searchForRecipes(search_params)
        .then((info_array) => { res.send(info_array);})
        .catch((error) => {res.status(500).send("something went wrong ! ");})
});



module.exports = router;