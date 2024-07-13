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

document.addEventListener('click', function(event) {
  // Check if the clicked element is a link with an href attribute
  if (event.target.tagName === 'A' && event.target.href) {
    
    // Forward Prediction
    token = new Date();
    predictSelection(event.target.href, token);

    // Prevent the default action (navigation)
    event.preventDefault();
    
    // Log the href value
    console.log('Link clicked: ' + event.target.href);
    console.log('Calculating risk ....')

    // Get response


    // Get User Confirmation
    const userConfirm = confirm("Are you sure you want to continue?")


    // Pause before redirecting
    setTimeout(function() {
      // Redirect after pause
      window.location.href = event.target.href;
    }, 10000); // Pause for 3 seconds
  }
}, false);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, token) {
  jObj = parseOutput()
  if (token == jObj.sesh_token){
    bubbleDOM.innerHTML = "This link is ${jObj.chance}% ${jObj.result}";
    bubbleDOM.style.top = mouseY + 'px';
    bubbleDOM.style.left = mouseX + 'px';
    bubbleDOM.style.visibility = 'visible';
  } else {
    console.log("Mismatched Token!")
  }
  
}

// Parse Response from HTTP Request
function parseOutput(){
  const response = getCalculation();
  console.log(response);
  const respObj = JSON.parse(response);
  return respObj
}

// Get Response through Fetch
async function getCalculation(){
  try {
    let response = await fetch('http://localhost:5000/get_url');
    let data = await response.json();

    console.log(data)
    return data
  } catch (error) {
    console.error('Error while fetching', error)
  }
}

// Forward HTTP Request with Method POST
function predictSelection(selection, token){
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:5000/detect_url", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.withCredentials=true;
  
  const body = JSON.stringify({
    url: selection,
    tokens: token
  });

  xhr.onload = () => {
    console.log(xhr.response)
  }

  xhr.onerror = () =>{
    console.log('Request failed with status: ${xhr.status}')
  }

  xhr.send(body)
}