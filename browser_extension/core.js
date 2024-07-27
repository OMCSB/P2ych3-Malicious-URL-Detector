var urls = {};
processLinks();

var popWindow = document.createElement('div')
popWindow.setAttribute('class', 'popWind');
document.body.appendChild(popWindow);

document.addEventListener("mouseover", function(event){
  currEl = event.target;
  if(currEl.tagName === 'H3'){
      let parentEl = currEl.parentElement;
      if (parentEl.tagName === 'A' && parentEl.href){
        let xPos = event.clientX;
        let yPos = event.clientY;
        let findUrl = urls[parentEl.href]
        let result = findUrl["Result"];
        let chance = findUrl["Chance"];
        renderPopWindow(result, chance, xPos, yPos);
      }
  }
}, false);

document.addEventListener("mouseout", function(event){
  popWindow.style.visibility = 'hidden';
}, false)

document.addEventListener('click', async function(event) {
  // Check if the clicked element is a link with an href attribute
  if (event.target.tagName === 'H3') {
    event.preventDefault();

    // Get Parent Element
    clickParent = event.target.parentElement;
    
    // Generate Token
    var token = new Date();
    let jsonToken = token.toJSON(); 

    // Log the href value
    console.log('Link clicked: ' + clickParent.href);
    console.log('Calculating risk of: ' + clickParent.href)

    // Wait for prediction
    const predResponse = await predictSelection(clickParent.href , token);
    const getUrl = await getPrediction();

    (async () => {
      // Check if renderUrl is not null or undefined
      if (getUrl) {
        let findJsonValue = getUrl.find(item => item.sesh_token === jsonToken);
        if (findJsonValue) {
          let result = findJsonValue["result"];
          let chance = findJsonValue["chance"];
          let time_taken = findJsonValue["time_taken"];

          if (predResponse == 1){
            setTimeout(() => {
              const userConfirm = confirm(`Are you sure you want to continue?\n\n'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\nThe Link is ${chance}% accurate of being a ${result} link !\n'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\nWhatever happens after this is outside of our jurisdiction!\n\nTime taken to complete: ${time_taken.toFixed(2)} seconds`);
              if (userConfirm){
                window.location.href = clickParent.href;
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
}, true);

function renderPopWindow(mouseR, mouseP, mouseX, mouseY){
  popWindow.innerHTML = `Result: ${mouseR} <br>Probability: ${mouseP}%`
  popWindow.style.height = '50px';
  popWindow.style.width = '150px';
  popWindow.style.top = mouseY + 'px';
  popWindow.style.left = mouseX + 'px';
  popWindow.style.visibility = 'visible';
}

// Get a node list of every child elements that matches the selector (.yuRUbf > div > span > a)
// Matches every anchor element under the '.yuRUbf' class's div's span element  
async function processLinks() {
  var links = document.querySelectorAll('.yuRUbf > div > span > a');
  let linkCnt = 0;
  let malCount = 0;
  console.log("Please wait while we search for malicious links");

  for (let link of links) {
    var token = new Date();
    var jsonTok = token.toJSON();

    // Extracts the HREF from each found in <a> element
    var extLink = link.getAttribute('href');
    
    linkCnt++;
    if (linkCnt == links.length){
      console.log(`Calculating... (${linkCnt}/${links.length})`)
      setTimeout(()=>{
        console.log(`Finished Calculating! Found ${malCount} Possible Malicious Link`)
      }, 500) 
    } else {
      console.log(`Calculating... (${linkCnt}/${links.length})`)
    };
      
    // Waits for promise response (1 or print error in console) from predictSelection function
    const postUrlResult = await predictSelection(extLink, token);

    if (postUrlResult == 1) {
      // Fetches URL in JSON format
      const getUrlResult = await getPrediction();

      if (getUrlResult) {
        // Returns 3 values from the parseJsonVal function
        let [gRes, gChan, gTT] = parseJsonVal(getUrlResult, jsonTok);

        // Append the values to 'urls' dictionary
        urls[extLink] = { "Result": gRes, "Chance": gChan, "Time_Taken": gTT };

        for (let childElement of link.children) {
          if (childElement.tagName === 'H3') {
            if (gRes === 'Benign') {
              childElement.style.backgroundColor = "green";
              childElement.style.color = "black";
            } else {
              malCount+=1;
              childElement.style.backgroundColor = "red";
              childElement.style.color = "white";
            }
          }
        }

      } else {
        console.log("Fetching failed");
      }
    }
  }
  return urls
}

function parseJsonVal(jsonVal, tok){
  let finding = jsonVal.find(item => item.sesh_token === tok);
  if (finding){
    var result = finding["result"];
    var chance = finding["chance"];
    var time_taken = finding["time_taken"];
    return [result, chance, time_taken]
  } else {
    console.log("No JSON Object Found!");
  }
}

async function getPrediction() {
  try{
    const promise = await fetch('http://localhost:5000/get_url');
    const promiseObj = await promise.json();
    return promiseObj;
  } catch (error){
    console.log(`Ran into an Error: ${error}`)
  }
};

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

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 204) {
          console.log("Risk Calculated!")
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