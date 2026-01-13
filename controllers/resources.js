//* MNT
const express = require('express');
const router = express.Router();
const { Asset, assetTemplate } = require('../models/Asset.js');
const { License, licenseTemplate } = require('../models/License.js');

//* VAR
const Resources = { Asset, License };
const templates = { Asset:assetTemplate, License:licenseTemplate }

//* ROUTE
// STATIC
// Index - GET /resources => Render all resources 
router.get('/', async (req,res) => {
    const data = {};
    for (let R in templates) {
        data[R] = await Resources[R].find({});
    };
    res.render('resources/index.ejs', { data, templates });
})

// New - GET /resources/new => Render the New resources form 
router.get('/new', (req,res) => res.render('resources/new.ejs'));


// DYNAMIC
// Index - GET /resources => Render all resources 
router.get('/:resourceType', async (req,res) => {
    const which = req.params.resourceType.replace(/s$/, '');
    console.log("WHICH", which)
    const Resource = Resources[which];
    const data = {}; data[which] = await Resource.find({});

    res.render('/index.ejs', { data, templates });
})

// New - GET /resources/new => Render the New resources form 
router.get('/:resourceType/new', (req,res) => {
    res.render(`resources/${req.params.resourceType}/new.ejs`);
})

// Delete - DELETE /resources/:resourceID => Delete a speciffic resource
router.delete('/:resourceType/:resourceId', async (req,res) => {
    const Resource = Resources[req.params.resourceType.replace(/s$/, '')];
    const data = await Resource.findById({ _id:req.params.resourceId });

    res.render('resources/delete-confirmation.ejs', { data });
})

// Update - PUT /resources/:resourceID (req.body) => Updata a speciffic resource using request body
router.put('/:resourceType', async (req,res) => {
    const Resource = Resources[req.params.resourceType.replace(/s$/, '')];
    
    Object.values(req.body).forEach(item => {
        if (Array.isArray(item)) {item = item.split(',')}
    });

    await Resource.findByIdAndUpdate(req.params.resourceId, req.body);

    res.redirect(`/resources/${req.params.resourceType}/${req.params.resourceId}`);
})

// Create - POST /resources => Use the Request body to create a new resource 
router.post('/:resourceType', async (req,res) => {
    const Resource = Resources[req.params.resourceType.replace(/s$/, '')];
    req.body['resourceType'] = req.params.resourceType.replace(/s$/, '');
    await Resource.create(req.body);

    Object.values(req.body).forEach(item => {
        if (Array.isArray(item)) {item = item.split(',')}
    });

    res.redirect(`/resources/${req.params.resourceType}/new`);
})

// Edit - GET /resources/:resourceID/edit => Render a pre-populated form to edit the resource 
router.get('/:resourceType/:resourceId/edit', async (req,res) => {
    const Resource = Resources[req.params.resourceType.replace(/s$/, '')];
    const data = Resource.findById(req.params.resourceId);

    res.render('resources/edit.ejs', { data });
})

// Show - GET /resources/:resourceID => Render a speciffic resource from the database 
router.get('/:resourceType/:resourceId', async (req,res) => {
    const Resource = Resources[req.params.resourceType.replace(/s$/, '')];
    const data = await Resource.findById({ _id:req.params.resourceId });

    res.render('resources/show.ejs', { data });
})


//* IO
module.exports = router;