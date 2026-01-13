
const assetData = [
  {
    resourceType: "asset",
    category: "Laptop",
    brand: "Dell",
    name: "Latitude 7420",
    serialNumber: 123456789,
    status: "In Use",
    assignedTo: "john-doe",
    purchaseDate: "1673740800000", 
    warrantyEnd: "1768512000000", 
    notes: "Assigned to IT department"
  },
  {
    resourceType: "asset",
    category: "Monitor",
    brand: "Samsung",
    name: "Odyssey G7",
    serialNumber: 987654321,
    status: "Available",
    assignedTo: "",
    purchaseDate: "1654819200000", 
    warrantyEnd: "1750118400000", 
    notes: "Stored in warehouse"
  },
  {
    resourceType: "asset",
    category: "Telephone",
    brand: "Cisco",
    name: "IP Phone 7841",
    serialNumber: 456789123,
    status: "In Use",
    assignedTo: "jane-smith",
    purchaseDate: "1616198400000", 
    warrantyEnd: "1710892800000", 
    notes: "Located in the finance department"
  },
  {
    resourceType: "asset",
    category: "Server",
    brand: "HP",
    name: "ProLiant DL380",
    serialNumber: 112233445,
    status: "In Use",
    assignedTo: "michael-jones",
    purchaseDate: "1604534400000", 
    warrantyEnd: "1709164800000", 
    notes: "Assigned to data center"
  },
  {
    resourceType: "asset",
    category: "Furniture",
    brand: "Ikea",
    name: "Office Chair",
    serialNumber: 998877665,
    status: "In Use",
    assignedTo: "office-team",
    purchaseDate: "1564617600000", 
    warrantyEnd: "1659312000000", 
    notes: "Main office furniture"
  }
];

// Dummy data for licenseSchema
const licenseData = [
  {
    resourceType: "license",
    category: "Internal",
    name: "Microsoft Office 365",
    vendor: "Microsoft",
    licenseKey: "ABC123-DEF456-GHI789",
    seatsTotal: 50,
    seatsUsed: 45,
    renewalDate: "1735689600000", 
    assignees: ["john-doe", "jane-smith", "michael-jones"]
  },
  {
    resourceType: "license",
    category: "Customer-Facing Application",
    name: "Salesforce CRM",
    vendor: "Salesforce",
    licenseKey: "CRM123-SALES456-FORCE789",
    seatsTotal: 100,
    seatsUsed: 80,
    renewalDate: "1750291200000", 
    assignees: ["sales-team", "it-team"]
  },
  {
    resourceType: "license",
    category: "Media",
    name: "Adobe Creative Cloud",
    vendor: "Adobe",
    licenseKey: "ADOBE123-CLOUD456-MEDIA789",
    seatsTotal: 20,
    seatsUsed: 18,
    renewalDate: "1725148800000", 
    assignees: ["design-team"]
  },
  {
    resourceType: "license",
    category: "Rental",
    name: "Zoom Pro",
    vendor: "Zoom",
    licenseKey: "ZOOM123-PRO456-RENTAL789",
    seatsTotal: 10,
    seatsUsed: 7,
    renewalDate: "1700438400000", 
    assignees: ["remote-team"]
  },
  {
    resourceType: "license",
    category: "Permit",
    name: "AWS Cloud",
    vendor: "Amazon",
    licenseKey: "AWS123-KEY456-CLOUD789",
    seatsTotal: 30,
    seatsUsed: 25,
    renewalDate: "1767225600000", 
    assignees: ["cloud-team", "it-team"]
  }
];

module.exports = { assetData, licenseData };

[assetData,licenseData].forEach(data => {
  const firstPass = JSON.stringify(data).replaceAll(/['"]/g, '')
  console.log(firstPass.replaceAll('},', '}; '))
})