document.addEventListener('click', async function(event) {
  // Check if the clicked element is a link with an href attribute
  if (event.target.tagName === 'A' && event.target.href) {
    // Prevent the default action (navigation)
    event.preventDefault();
    
    // Generate Token
    var token = new Date();
    let jsonToken = token.toJSON(); 

    // Log the href value
    console.log('Link clicked: ' + event.target.href);

    // Wait for prediction
    const predResponse = await predictSelection(event.target.href, token);

    // Get response
    const getUrl = async function() {
      try{
        const promise = await fetch('http://localhost:5000/get_url');
        const promiseObj = await promise.json();
        return promiseObj;
      } catch (error){
        console.log('Ran into an Error: ${error}')
      }
    };

    (async () => {
      // Await the promise returned by getUrl
      const renderUrl = await getUrl(); 
      
      // Check if renderUrl is not null or undefined
      if (renderUrl) {
        let findJsonValue = renderUrl.find(item => item.sesh_token === jsonToken);
        if (findJsonValue) {
          let result = findJsonValue["result"];
          let chance = findJsonValue["chance"];
          let time_taken = findJsonValue["time_taken"];

          if (predResponse == 1){
            setTimeout(() => {
              const userConfirm = confirm(`Are you sure you want to continue?\n\n'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\nThe Link is ${chance}% accurate of being a ${result} link !\n'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\nWhatever happens after this is outside of our jurisdiction!\n\nTime taken to complete: ${time_taken.toFixed(2)} seconds`);
              if (userConfirm){
                window.location.href = event.target.href;
              } 
              console.log("Good Choice :)"); 
            }, 1000);
          };
        } else {
          console.log('No matching token found');
        }
      }
    })();
  }
}, false);

// Forward HTTP Request with Method POST
function predictSelection(selection, token){
  const xhr = new XMLHttpRequest();
  setTimeout(() => {
    console.log("Calculating Risk!")
  }, 500);
  
  xhr.open("POST", "http://localhost:5000/detect_url", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.withCredentials=true;
  
  const body = JSON.stringify({
    url: selection,
    tokens: token
  });

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 204) {
          console.log("Risk Calculated!!")
          resolve(1); // Success code
        } else {
          reject(new Error(`Request failed with status: ${xhr.status}`));
        }
      }
    };

    xhr.onerror = reject;

    xhr.send(body);
  });
}