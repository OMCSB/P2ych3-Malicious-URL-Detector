// Add bubble to the top of the page.
var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);

// document.addEventListener('mouseover', function(event) {
//     var hoveredEl = event.target; // The actual element which was hovered.
//     console.log(hoveredEl.href); // Do what we want here!
// });

// // Lets listen to mouseup DOM events.
// document.addEventListener('mouseover', function (e) {
//   var selection = window.getSelection().toString();
//   if (selection.length > 0) {
//     renderBubble(e.clientX, e.clientY, selection);
//   }
// }, false);


// // Close the bubble when we click on the screen.
// document.addEventListener('mousedown', function (e) {
//   bubbleDOM.style.visibility = 'hidden';
// }, false);

document.addEventListener('click', async function(event) {
  // Check if the clicked element is a link with an href attribute
  if (event.target.tagName === 'A' && event.target.href) {
    // Prevent the default action (navigation)
    event.preventDefault();
    
    // Generate Token
    var token = new Date();

    // Log the href value
    console.log('Link clicked: ' + event.target.href);

    // Wait for prediction
    const prom = await predictSelection(event.target.href, token);

    // Get response
    const response = parseOutput();
    console.log(response)

    // Get User Confirmation
    if (prom == 1){
      const userConfirm = confirm("Are you sure you want to continue?\n \nWhatever happens after this is outside of our jurisdiction!")
      if (userConfirm){
        window.location.href = event.target.href;
      } 
      console.log("Good Choice :)")
    };
  }
}, false);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, token) {
  jObj = parseOutput()
  if (token == jObj.sesh_token){
    bubbleDOM.innerHTML = "This link is ", jObj.chance, "% ", jObj.result;
    bubbleDOM.style.top = mouseY + 'px';
    bubbleDOM.style.left = mouseX + 'px';
    bubbleDOM.style.visibility = 'visible';
  } else {
    console.log("Mismatched Token!")
  }
  
}

// Parse Data from HTTP Request
function parseOutput(){
  getCalculation().then(data => {
    data;
  });
  const respObj = JSON.parse(data);
  return respObj
}

// Get Data through Fetch
async function getCalculation(){
  try {
    let response = await fetch('http://localhost:5000/get_url');
    let data = await response.json();

    // console.log(data)
    return data;
  } catch (error) {
    console.error('Error while fetching', error);
  }
}

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