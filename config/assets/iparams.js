// let debounceTimeout;

// function checkEmailId(newValue) {
//     // Input type validation
//     if (!isNaN(newValue)) {
//         return Promise.reject("Account ID has to be a string");
//     }

//     // Clear the previous timeout
//     if (debounceTimeout) {
//         clearTimeout(debounceTimeout);
//     }

//     // Return a promise that resolves after the debounce delay
//     return new Promise((resolve, reject) => {
//         debounceTimeout = setTimeout(() => {
//             const options = { email: newValue };
//             validateWithAPI(options)
//                 .then(resolve)
//                 .catch(reject);
//         }, 2000);
//     });
// }

// function firstnameChange(newValue) {
//     // Input type validation
//     // if (!isNaN(newValue)) {
//     //     return Promise.reject("Account ID has to be a string");
//     // }

//     // Clear the previous timeout
//     if (debounceTimeout) {
//         clearTimeout(debounceTimeout);
//     }

//     // Return a promise that resolves after the debounce delay
//     return new Promise((resolve, reject) => {
//         debounceTimeout = setTimeout(() => {
//             const options = { phone_no: newValue };
//             validateWithAPI(options)
//                 .then(resolve)
//                 .catch(reject);
//         }, 2000);
//     });
// }

// // Example of the validateWithAPI function
// async function validateWithAPI(options) {
//     // Simulate API call
//     return new Promise((resolve, reject) => {
//         setTimeout(async () => {
//             console.log("options", options);
//             let appClient; // Declare variable to hold the client

//             try {
//                 // Load the app client script dynamically
//                 const script = document.createElement('script');
//                 script.src = '{{{appclient}}}'; // Replace with your actual script URL
//                 script.defer = true;
//                 document.head.appendChild(script);

//                 // Wait for the app client to initialize
//                 appClient = await app.initialized();
//                 console.log('App client initialized successfully.');

//                 // Invoke the server method via app client
//                 const response = await appClient.request.invoke('serverMethod', options);
//                 console.log('CRM data response:', response);

//                 if (response) {
//                     try {
//                         let data = await appClient.interface.trigger("showNotify", {
//                             type: "success",
//                             message: "The details have been updated." /* The "message" should be plain text */
//                         });
//                         console.log(data); // success message
//                     } catch (error) {
//                         // failure operation
//                         console.error(error);
//                     }
//                 }
//                 // Resolve the promise with the response
//                 resolve(response);
//             } catch (error) {
//                 console.error('Error:', error);
//                 // Reject the promise with an error message
//                 reject('Error:', error);
//             }
//         }, 1000); // Simulate API response delay
//     });
// }
