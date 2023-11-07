
let dataLoggers = document.getElementById("data-loggers");

// Remove class by prefix, used to change the color of bootstrap components.
function removeClassByPrefix(el, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    el.className = el.className.replace(regx, '');
    return el;
}

// Update the color by removing text-color classes and append new one.
function updateState(el, state) {
    removeClassByPrefix(el, "text");
    el.classList.add(state);
}

function resetAllElements()
{
    for (let el of dataLoggers.children)
        updateState(el, "text-secondary");
}


// Get Heartbeat signals using HTPP request.
// For now the fetchinng returns a modified string version of JSON. 
// This function is used for testing purposes. To replace later with the production one. 
async function fetchHearbeatStatus() {
    return fetch('http://localhost:5500/app', {
        method: 'GET', 
        headers: {
            'Content-Type': 'text/plain' //'application/json', // set the appropriate content type
        },
    })
    .then(response => response.text())
    .then(response => JSON.parse(response))
    .catch(error => {
        console.error('Error:', error);
    });
}

// Returns the modified body of the item.
// It changed the color of the display according to the state.
function getListItem(stateObj)
{
    return `
            <div class="row g-0">
            <div class="col-md-3">
                <img src="https://store.citroen.fr/ami/images/preconfigs/P001/P001_ami_orange.png" class="card-img" alt="Your Image">
            </div>
            <div class="col-md-8">
                <div class="card-body data-logger">
                <div class="d-flex align-items-center mb-3">
                    <strong class="data-logger-name">${stateObj['Vehicle Vin']}</strong>
                    <div class="spinner-grow text-primary ms-auto data-logger-state" role="status" aria-hidden="true"></div>
                </div>
                <p class="mb-3"><strong>Vehicle Name: </strong>${stateObj['Vehicle Name']}</p>
                <p class="mb-3"><strong>Battery state bars: </strong>${stateObj['Battery State Bars']}/9</p>
                <p class="mb-3"><strong>Odometer: </strong>${stateObj['Odometer'].toFixed(2)} Km</p>
                <button class="btn btn-primary mt-3" data-bs-toggle="collapse" data-bs-target="#collapseExample_2" aria-expanded="false" aria-controls="collapseExample">
                    Show More
                </button>
                <div class="collapse mt-3" id="collapseExample_2">
                    <div class="card card-body">
                        <p><strong>Speed: </strong>${stateObj['Vehicle Speed']} Km/h</p>
                        <p><strong>Battery State of Charge: </strong>${stateObj['State of Charge']}</p>
                        <p><strong>Remaining Charge Time: </strong>${stateObj['Remaining Charge Time']}</p>
                        <p><strong>Stop: </strong>${stateObj['Stop'] == 1 ? 'False' : 'True'}</p>
                        <p><strong>Remaining Autonomy: </strong>${stateObj['Remaining Autonomy']} Km</p>
                        <p><strong>Turtle Mode: </strong>${stateObj['Turtle Mode'] == 1 ? 'False' : 'True'}</p>
                        <p><strong>Brake System Problem: </strong>${stateObj['Brake System Problem'] == 1 ? 'False' : 'True'}</p>
                        <p><strong>Left Indicator: </strong>${stateObj['Left Indicator'] == 1 ? 'False' : 'True'}</p>
                        <p><strong>Right Indicator: </strong>${stateObj['Right Indicator'] == 1 ? 'False' : 'True'}</p>
                        <p><strong>Trigger Clicked: </strong><span style="padding: 5px;" class="bg-dangerp-3 mb-2 ${stateObj['Trigger Clicked'] == 0 ? 'bg-success text-white' : 'bg-danger text-white'}">${stateObj['Trigger Clicked']}</span></p>
                    </div>
                </div>
                </div>
            </div>
            </div>`;
}

// Updates the element by replacing its body by the modified one.
function updateStateItem(stateObj){
    if(!stateObj) 
        return null;
    let item = document.getElementById(stateObj['Vehicle Vin']);
    console.log(item, typeof item);

        if(!item)
        {
            item = document.createElement('li');
            item.setAttribute('id', stateObj['Vehicle Vin']);
            item.id = stateObj['Vehicle Vin'];
            item.classList.add('list-group-item');
            let div = document.createElement('div');
            div.classList.add('card');
            item.appendChild(div);
        }
        item.children[0].innerHTML = getListItem(stateObj);
        console.log(item.innerHTML);
    return item;
}

// setInterval(fetchHearbeatStatus, 1000);

async function main()
{
    try{
        let obj = await fetchHearbeatStatus();
        if(obj && Object.keys(obj).length > 0)
        {
            console.log(obj, typeof obj);
            dataLoggers.appendChild(updateStateItem(obj));
        }
        else 
        {
            console.log(obj, typeof obj);
            throw "No data is present";
        }
    }catch(err)
    {
        console.log("error in main", err);
        resetAllElements();
    }
    
}

setInterval(main, 10000);
