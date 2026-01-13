const mongoose = require('mongoose');

const licenseTemplate = {
    resourceType:String,
    category:String,
    name:String,
    vendor:String,
    licenseKey:String,
    seatsTotal:Number,
    seatsUsed:Number,
    renewalDate:Date,
    assignees:Array,
    notes:String,
};

const licenseSchema = new mongoose.Schema(licenseTemplate);

licenseSchema.pre('save', function() {
    // console.log("NEXT:: ", next)
    this.resourceType = 'license';
    // next ();
});

const License = mongoose.model('license', licenseSchema);

module.exports = { License, licenseTemplate };