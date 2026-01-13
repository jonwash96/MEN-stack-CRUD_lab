require('./db/connection.js');
const prompt = require('prompt-sync')();
const { Asset, assetTemplate } = require('./models/Asset.js');
const { License, licenseTemplate } = require('./models/License.js');

//* VAR
let action;

//* DATA
let resources;
let Resource;
const Resources = { Asset, License };
const templates = {
    Asset: Object.keys(assetTemplate),
    License: Object.keys(licenseTemplate),
};
    
//* FUNC
const getResources = async () => resources = await Resource.find({});
const exit = () => console.log("press '^C' to exit.");

async function selectAction() {
    let input;
    console.log("\n",
        1, "Assets\n",
        2, "Licenses\n",
        3, "View All",
        "\n"
    );
    input = prompt('Select a resource Type: ');
    switch (input) {
        case '1': Resource = Resources.asset; break;
        case '2': Resource = Resources.license; break;
        case '3': {for (let r in Resources) {
            const all = await Resources[r].find({});
            console.log(all);
        } return exit();} break;
    };
    input==='1' && (Resource = Resources.asset);
    input==='2' && (Resource = Resources.license);
    await getResources();

    console.log("\nWelcome to the CRM\nType 'q' to Quit\nWhat would you like to do?");
    console.log("\n",
        1, "Create a resource\n",
        2, "View all resources\n",
        3, "Update a Resource\n",
        4, "Delete a resource\n",
        5, "quit",
        "\n"
    );
    
    action = prompt("Type the number of the action you want to run. ");
    if (action === 'q') return exit();

    switch (action) {
        case '1':
        case 'create': {return create()}; break;
        case '2':
        case 'read': {return read()}; break
        case '3':
        case 'update': {return update()}; break;
        case '4':
        case 'delete': {return deleteResource()}; break;
    };
}

async function create() {
    let input;
    let newResources = [];
    console.log("\nEnter a new resource in either js object or CSV 'k:v' format: <key:value>; <key:value>\n Separate each property by comma.\n Do not wrap names in quotes.\n Use ';' to separate each new resource.\nIf you prefer a prompt for each field, type 'p'.\nType 'q' to Quit");
    input = prompt("New Resources: ");
    if (input === 'q') return exit();

    if (input === 'p') {
        let run = true;
        while (run) {
            const newResource = {};
            const template = templates[Resource.modelName];
            for (let key of template) {
                newResource[key] = prompt(`${key}`, '');
            };
            // newResource['updated'] = Date.now();
            console.log(newResource, "\n");

            const confirmation = prompt("Is all the information correct? Type 'q' to Quit. Type 'y' for yes, 'n' for no. ");
            if (confirmation === 'q') return exit();
            if (confirmation === 'y') {
                resources.push(newResource);
                console.log("Do you have more resources to add?");
                const loop = prompt("Type 'y' for yes, or 'q' to Quit. ");
                if (loop === 'q') return exit();
                if (loop !== 'y') break;
            }
            else if (confirmation !== 'n') {
                while (true) {
                    const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                    if (confirmationErr === 'y') {
                        resources.push(newResource);
                        console.log(newResource);
                        run = false;
                    };
                    if (confirmationErr === 'n') break;
                    if (confirmationErr === 'q') return exit();
                }
            }
        };
    } else {
        let run = true;
        while (run) {
            const array = input.split(';');
            if (array[0].match(/\w+\:\s?['"]?\w+['"]?,?/g)) {
                array.forEach(obj => {
                    const newObj = {};
                    let noBraces = obj.replaceAll(/[\{\}]/g, '');
                    console.log("NO BRACES", noBraces);
                    noBraces = noBraces.replaceAll(/(?<=\[.+)\,(?=.+\])/g, '&'); // Prep arrays
                    noBraces.split(',').forEach(pair => {
                        const bits = pair.split(':');
                        if (bits[1].includes('[')) {
                            newObj[bits[0].trim().replaceAll(/['"]/g, '')]
                             = bits[1].replaceAll(/[\[\]]/g, '').split('&');
                        } else {
                            newObj[bits[0].trim().replaceAll(/['"]/g, '')]
                                = bits[1].trim().replaceAll(/['"]/g, '');
                        }
                    });
                    // newObj['updated'] = Date.now();
                    newResources.push(newObj);
                });
            } else {
                    console.log("\nParse Error! Retry")
                    return create();
            };

            console.log("\n", newResources, "\nCreating "+newResources.length + " New Resources.\n");
            input = prompt("Does the above information look correct? Type 'y' for yes, 'n' for no, or 'q' to Quit. ");
            if (input==='q') {return;
            } else if (input==='y') {break;
            } else if (input==='n') {newResources = []; input = prompt("New Resources: ");
            } else {
                while (run) {
                    const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                    if (confirmationErr==='q') return exit();
                    if (confirmationErr === 'y') run = false;
                    if (confirmationErr==='n') return(create());
                }
            }
        };

        await newResources.forEach(resource => {
            Resource.create(resource);
        });
        resources.push(...newResources);
        newResources = [];
    };

    input = prompt("Do you have more to add? Type 'y' for yes, or 'enter' to return to the menu, or 'q' to Quit. ")
    if (input === 'q') return exit();
    if (input === 'y') return create();

    selectAction();
}

async function read() {
    await getResources();
    let input, foundResource;
    let list = [];
    const last5Resources = resources.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently updatedresources.");
    for (let i = 0; i < 5; i++) {
        list.push(last5Resources[i]);
        if (!last5Resources[i]) break;
        console.log(i + 1, "id: " + last5Resources[i].id, "name: " + last5Resources[i].name, "category: " + last5Resources[i].category);
    }

    console.log("\nTo see all resources, type 'a' or 'all'.\nTo inspect a specific resource, type the number or enter a resourceID.");
    input = prompt("Type 'q' to Quit. To return to the main menu, type any other key. ");
    if (input === 'q') return exit();

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Resources:");
        for (let i = 0; i < resources.length; i++) {
            list.push(resources[i]);
            console.log(i + 1, "id: ", resources[i].id, "name: ", resources[i].name, "category: ", resources[i].category);
        };
        console.log("\nTo inspect a specific resource, type the number or enter a resourceID.");
        input = prompt("Type 'q' to Quit. To return to the main menu, type 'n'. ");
        if (input === 'q') return exit();
        if (input === 'n') return selectAction();
    };

    while (true) {
        if (list[input - 1] || resources.find(resource => resource.id === input)) break;
        console.log("\nNot found! Select the number of the resource you want to update, or paste in the resourceID.\nType 'q' to Quit or 'a' to view all.")
        input = prompt("Number or resourceID: ");
        if (input === 'q') return exit();
        if (input==='a') return read();
    };

    input.length <= 3
        ? foundResource = resources.find(resource => resource.id === list[input -1].id)
        : foundResource = resources.find(resource => resource.id === input);

    console.log("\n", foundResource);
    // console.log("\nActions:", 1, "Update Resource", 2, "Delete Resource", 3, "View All Resources");
    input = prompt("\nType 'q' to Quit, 'a' to view all resources, or 'enter' to return to the main menu. ");
    switch (input) {
        case '1': update(foundResource.id); break;
        case '2': deleteResource(foundResource.id); break;
        case 'a': 
        case '3': read(); break;
        case 'q': return exit(); break;
    };
    return selectAction();
}

async function update() {
    await getResources();
    let input, foundResource;
    let list = [];
    const last5Resources = resources.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently updatedresources.");
    for (let i = 0; i < 5; i++) {
        if (!resources[i]) break;
        list.push(last5Resources[i]);
        console.log(i + 1, "id: " + last5Resources[i].id, "name: " + last5Resources[i].name, "category: " + last5Resources[i].category);
    }

    console.log("\nSelect the number of the resource you want to update, or paste in the resourceID of any resource.\nTo see all resources, type 'a' or 'all'\nType 'q' to Quit.");
    input = prompt("Number or ResourceID: ");
    if (input === 'q') return exit();

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Resources:");
        for (let i = 0; i < resources.length; i++) {
            list.push(last5Resources[i]);
            console.log(i + 1, "id: ", last5Resources[i].id, "name: ", last5Resources[i].name, "category: ", last5Resources[i].category);
        };
        input = prompt("\nSelect the number of the resource you want to update, or paste in the resourceID. ");
        if (input === 'q') return exit();
    };


    while (true) {
        if (list[input - 1] || resources.find(resource => resource.id === input)) break;
        console.log("Not found! Select the number of the resource you want to update, or paste in the resourceID.\nType 'q' to Quit.")
        input = prompt("Number or resourceID: ");
        if (input === 'q') return exit();
    };

    input.length <= 3
        ? foundResource = resources.find(resource => resource.id === list[input -1].id)
        : foundResource = resources.find(resource => resource.id === input);

    console.log(`\nUpdate ${JSON.stringify(foundResource)}?`);
    const geaux = prompt("Type 'y' for yes, 'n' for no, or type 'q' to Quit. ");
    if (input === 'q') return exit();

    if (geaux === 'y') {
        let run = true;
        let updatedResource = {};
        while (run) {
        console.log("\nEnter the information you want to update as key-value pairs in CSV format.\nIf you prefer a prompt for each field, type 'p'\nFormat = id:<resourceID>, name:<resourcename>, age:<age>");
        const result = prompt("update Information: ");

            if (result === 'p') {
                console.log("\nEnter new information for each field, or leave unchanged.")
                const template = templates[Resource.modelName];
                for (let key of template) {
                    updatedResource[key] = prompt(`${key}`, updatedResource[key]);
                };
            } else {
                updatedResource = Object.create(foundResource);
                    result.split(',').forEach(pair => {
                        const bits = pair.split(':');
                        bits.forEach(bit => {
                            updatedResource[bits[0].trim()] = bits[1].trim();
                        })
                    });
            };
            
            updatedResource.updated = Date.now();
            console.log("\n", updatedResource);
    
            input = prompt("Does the above information look correct? Type 'y' for yes, 'n' for no, or 'q' to Quit. ");
            if (input==='q') {return;
            } else if (input==='y') {break;
            } else if (input==='n') {null;
            } else {
                while (run) {
                    const confirmationErr = prompt("Invalid Key Pressed! Type 'q' to Quit. Is all the information correct? Type 'y' for yes, 'n' for no. ");
                    if (confirmationErr==='q') return exit();
                    if (confirmationErr === 'y') run = false;
                    if (confirmationErr==='n') break;
                }
            }
        };
        foundResource = updatedResource;
        Resource.findByIdAndUpdate(updatedResource.id, updatedResource);

    } else {
        console.log("Aborted! Please try a new search.");
        update();
    };

    selectAction();
}

async function deleteResource() {
    await getResources();
    let input, foundResource;
    let list = [];
    const last5Resources = resources.sort((a, b) => a.updated + b.updated);

    console.log("\n5 Most recently updatedresources.");
    for (let i = 0; i < 5; i++) {
        if (!resources[i]) break;
        list.push(last5Resources[i]);
        console.log(i + 1, "id: " + last5Resources[i].id, "name: " + last5Resources[i].name, "category: " + last5Resources[i].category);
    }

    console.log("\nSelect the number of the resource you want to delete, or paste in the resourceID of any resource.\nTo see all resources, type 'a' or 'all'. Type 'q' to Quit.");
    input = prompt("Number or ResourceID: ");
    if (input === 'q') return exit();

    if (/^a$|^all$/i.test(input)) {
        list = [];
        console.log("\nAll Resources:");
        for (let i = 0; i < resources.length; i++) {
            list.push(last5Resources[i]);
            console.log(i + 1, "id: ", last5Resources[i].id, "name: ", last5Resources[i].name, "category: ", last5Resources[i].category);
        }
        input = prompt("Select the number of the resource you want to delete, or paste in the resourceID. ");
        if (input === 'q') return exit();
    };


    while (true) {
        if (list[input - 1] || resources.find(resource => resource.id === input)) break;
        console.log("Not found! Select the number of the resource you want to delete, or paste in the resourceID.\nType 'q' to Quit.")
        input = prompt("Number or resourceID: ");
        if (input === 'q') return exit();
    };

    input.length <= 3
        ? foundResource = resources.find(resource => resource.id === list[input - 1].id)
        : foundResource = resources.find(resource => resource.id === input);

    console.log(`\nDelete ${JSON.stringify(foundResource)}?`);
    const geaux = prompt("Type 'y' for yes, 'n' for no, or type 'q' to Quit.");
    if (input === 'q') return exit();

    if (geaux === 'y') {
        resources.splice(resources.findIndex(resource => resource.id === foundResource.id), 1);
        const deleteStatus = await Resource.findByIdAndDelete(foundResource.id);
        console.log("\nDELETED:\n", deleteStatus);
    } else {
        console.log("Aborted! Please try a new search.");
        deleteResource();
    };

    selectAction();
}

//* RUN
selectAction();