//* MNT
const express = require('express');
const router = express.Router();
const { Asset, assetTemplate } = require('../models/Asset.js');
const { License, licenseTemplate } = require('../models/License.js');

//* VAR
const templates = { Asset:assetTemplate, License:licenseTemplate }

//* ROUTE

// 1. Exact match
// 2. Fuzzy Match
// 3. Match Each word (excluding common), sort by num of words matched
// 4. Fuzzy Match Each word (excluding common words), sort by num of words matched
// 5. Match related by Brand/Category

// Search Should (Next Steps):
    // Detect srtuctured input
    // Be completeley autonomous/"Omni" with option for explicit refinement
    // Handle Plurality (/s$/ ? /.+?$/ : /s?$/)
    // Handle misspellings (to some degree)[Search term minus each letter] (n^n-too-many when more than 1 word)
    // Associate Categories with brands (if "laptop"; Search Dell, HP, Acer...)
    // Detect Name patterns (Model-name, Model-number) For a more targeted search

//!Currently Unstable. More R&D Neccesary.
router.post('/', async (req,res) => {
    console.log("RUN SEARCH()");
    let results = [];
    let searchByRegex = {};
    let resourceTypes = {License, Asset};
    let regexStr;
    let data = {exact:[], fuzzy:[]};

    if (!req.body.searchString.match(/licenses?/gi)) delete resourceTypes.License;
    if (!req.body.searchString.match(/assets?/gi)) delete resourceTypes.Asset;
    if (Object.values(resourceTypes).length===0)  resourceTypes = {License, Asset};
    
    Object.values(resourceTypes).forEach(async resourceType => {
        // 1. Exact match
        // Exact Match Full Term
        searchByRegex = {};
        regexStr = req.body.replace(/licenses?|assets?/gi, '');
        regex = new RegExp(regexStr, 'ig');
        Object.entries(templates[resourceType.modelName]).forEach(([k,v]) => 
            searchByRegex[k] = regexStr);
        results = await resourceType.find(searchByRegex);
        if (results) data.exact.push(...results);
        // 3. Match Each word
        // Exact Match Each Word of query
        searchByRegex = {}; results = [];
        await regexStr.split(' ').forEach(async (word) => {
            Object.entries(templates[resourceType.modelName]).forEach(([k,v]) => 
                searchByRegex[k] = word);
            results = await resourceType.find(searchByRegex);
            if (results) data.exact.push(...results);
        });

        // 2. Fuzzy Match
        // Fuzzy Match Full Term
        searchByRegex = {}; results = [];
        regexStr = req.body.replace(/licenses?|assets?/gi, '')
            .split('').map(char => `${char}.*`).join('');
        regex = new RegExp(regexStr, 'ig');
        Object.entries(templates[resourceType.modelName]).forEach(([k,v]) => 
            searchByRegex[k] = regexStr);
        results = await resourceType.find(searchByRegex);
        if (results) data.fuzzy.push(...results);
        // 4. Fuzzy Match Each word
        // Fuzzy Match Each Word of query
        searchByRegex = {}; results = [];
        regexStr = req.body.replace(/licenses?|assets?/gi, '')
            .split('').map(char => char!==' ' && `${char}.*`).join('');
        await regexStr.split(' ').forEach(async (word) => {
            regex = new RegExp(word, 'ig');
            Object.entries(templates[resourceType.modelName]).forEach(([k,v]) => 
                searchByRegex[k] = word);
            results = await resourceType.find(searchByRegex);
            if (results) data.fuzzy.push(...results);
        });
    });

    res.render('search-results.ejs', { data });
})

//* IO
module.exports = router;