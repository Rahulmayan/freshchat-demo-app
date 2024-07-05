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
    return validateWithAPI(newValue);
}
/**
* In this case, for example, we are making use of `httpbin.org` to return 200 OK status.
* In real-world, this could be a valid third-party API that can return an appropriate status code indicating the status of validation
* Payload and other options can be specified using `options`
* Notice the presence of the debounce logic to avoid rate-limiting issues.
*
* @param {string} value
*/
function validateWithAPI(value) {
    //Assume it is the validation/resource endpoint
    var url = "https://httpbin.org/status/200";
    var options = {
        body: JSON.stringify({
            param: value
        })
    };
    var p = new Promise(function (resolve, reject) {
        // Do not hit the validation API immediately upon change.
        // Wait for 500ms and if the user hasn't typed anything during that time, make a call
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            client.request.post(url, options).then(
                function (data) {
                    // Upon success, just resolve
                    resolve();
                },
                function (error) {
                    // Upon failure - send an appropriate validation error message
                    reject("This Account ID does not exist. Please enter the right one");
                }
            );
        }, 500);
    });
    return p;
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

  document.addEventListener("DOMContentLoaded", function() {
    // Query the parent class
    const parent = document.querySelector('.vue-form-generator');
    
    console.log("parent",parent)
    if (parent) {
      // Create a new button element
      const button = document.createElement('button');
      button.innerText = 'Add Field';
      button.id = 'add-field-btn';
  
      // Append the button to the parent element
      parent.appendChild(button);
  
      // Add event listener to the button
      button.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = `dynamic_field_${parent.children.length}`;
        input.placeholder = 'Enter value';
        parent.appendChild(input);
      });
    }
  });
  
  