/**
* Using this iparam callback function, we are validating the details using a third-party API.
*
* @param {string} newValue The new value of the iparam field
*/
function checkAccountID(newValue) {
    //Input type validation
    if (!isNaN(newValue)) {
        return Promise.reject("Account ID has to be a string");
    }
    console.log("newvalue",newValue)
    return validateWithAPI(newValue);
}

function firstnameChange(arg) {
    //validation logic and subsequent action performed
    //arg is the iparam value passed to the callback function
    console.log("firstnameChange",arg);
  }
/**
* In this case, for example, we are making use of `httpbin.org` to return 200 OK status.
* In real-world, this could be a valid third-party API that can return an appropriate status code indicating the status of validation
* Payload and other options can be specified using `options`
* Notice the presence of the debounce logic to avoid rate-limiting issues.
*
* @param {string} value
*/
async function validateWithAPI(value) {
    // Assume it is the validation/resource endpoint
    console.log("entered validateWithAPI");
    var url = "https://httpbin.org/status/200";
    var options = {
        body: JSON.stringify({
            param: value
        })
    };

    // Wrap the asynchronous logic in a promise
    return new Promise((resolve, reject) => {
        // Do not hit the validation API immediately upon change.
        // Wait for 500ms and if the user hasn't typed anything during that time, make a call
        console.log("inside the API call");
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            try {
                const data = await client.request.post(url, options);
                // Upon success, just resolve
                console.log("data for url get request", data);
                resolve();
            } catch (error) {
                // Upon failure - send an appropriate validation error message
                reject("This Account ID does not exist. Please enter the right one");
            }
        }, 500);
    });
}


function toggleFieldsVisibility(cm) {
    if (!Array.isArray(cm))
        return console.error("Something went wrong while toggling field visibility");
    utils.set("twitter_id", {
        visible: cm.includes("Twitter ID")
    });
    utils.set("twitter_tags", {
        visible: cm.includes("Twitter ID")
    });
    utils.set("tags", {
        visible: cm.includes("Twitter ID")
    });
    utils.set("mobile", {
        visible: cm.includes("Mobile")
    });
}

function contactMethodChanged() {
    //Let us get the selected options for contact methods
    const cm = utils.get("contact_methods");
    console.info(cm);
}

//  document.getElementById('add-field').addEventListener('click', function() {
//   const dynamicFields = document.getElementById('dynamic-fields');
//   const input = document.createElement('input');
//   input.type = 'text';
//   input.name = `dynamic-field-${dynamicFields.children.length}`;
//   dynamicFields.appendChild(input);
// });
// document.addEventListener("DOMContentLoaded", function() {
//   const container = document.getElementById("dynamic-fields-container");
//   const addButton = document.getElementById("add-field-btn");

//   console.log("container",container,addButton)

//   addButton.addEventListener("click", function() {
//     const input = document.createElement("input");
//     input.type = "text";
//     input.name = `dynamic_field_${container.children.length}`;
//     input.placeholder = "Enter value";
//     container.appendChild(input);
//   });
// });

document.addEventListener("DOMContentLoaded", function () {

    let appClient; // Declare variable to hold the client

    try {
        const script = document.createElement('script');
        script.src = '{{{appclient}}}';
        // script.addEventListener('load', () => {
        //     // When script is loaded, setLoaded(true) can be invoked if needed
        //     setLoaded(true);
        // });
        script.defer = true;
        document.head.appendChild(script);
    
        // Initialize app client
        app.initialized().then((client) => {
            appClient = client; // Assign the client to appClient variable
            // You can use appClient here or do additional processing
        }).catch((error) => {
            console.error('Error initializing app client:', error);
        });
    } catch (error) {
        console.error('Error loading script:', error);
    }
    
    // Query the parent class
    const parent = document.querySelector('.vue-form-generator');

    console.log("parent", parent)
    if (parent) {
        // Create a new button element
        const button = document.createElement('button');
        button.innerText = 'Add Field';
        button.id = 'add-field-btn';

        // Append the button to the parent element
        parent.appendChild(button);

        // Add event listener to the button
        button.addEventListener('click', async function () {
            try {
                console.log('Starting button click',await appClient.request.invoke("serverMethod",{}));
        
                // Invoke the server method
                const response = await appClient.request.invoke("serverMethod");
                console.log("CRM data response:", response);
                
                // Handle the response data as needed
                // For example, update UI or process the returned data
                
            } catch (error) {
                console.error("Error fetching CRM data:", error);
            }
        });        
    }
});
