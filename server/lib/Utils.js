// Function to process CRM data and return final response
const processCrmData = (data) => {
  const processedData = {};
  let hasData = false;

// Display errorResponse if it has a value
  if (data.errorResponse && data.errorResponse.Message !== null) {
    processedData["errorResponse"] = data.errorResponse.Message;
    return processedData;
  }

  // Iterate over keys in data and extract the first object from arrays
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key]) && data[key].length > 0) {
      processedData[key] = data[key][0];
      hasData = true;
    }
  });

  // Handle Errorcase when no data is found
  if (!hasData) {
    processedData["errorResponse"] = "No record found";
  }

  return processedData;
};

// Function to log an error and throw an exception
const logAndThrowError = (message) => {
  console.error(message);
  throw new Error(message);
};

function handleServerError(error) {
  if (error.status) {
    // Handle API request error
    console.error('API request error:', error?.status, error?.response);
  } else {
    // Handle normal function error
    console.error('Normal function error:', error?.message);
  }
}


exports = { processCrmData,logAndThrowError,handleServerError }
