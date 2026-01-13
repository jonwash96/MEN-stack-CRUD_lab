const mongoose = require('mongoose');

const assetTemplate = {
    resourceType:String,
    category:String,
    brand:String,
    name:String,
    serialNumber:Number,
    status:String,
    assignedTo:String,
    purchaseDate:Date,
    warrantyEnd:Date,
    notes:String
};

const assetSchema = new mongoose.Schema(assetTemplate);

assetSchema.pre('save', function() {
    this.resourceType = 'asset';
    // next();
});

const Asset = mongoose.model('asset', assetSchema);

module.exports = { Asset, assetTemplate };