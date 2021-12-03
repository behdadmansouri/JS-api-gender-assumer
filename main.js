const textbox = document.querySelector('.textbox');
const submit = document.querySelector('#submit');
const save = document.querySelector('#save');
const clear = document.querySelector('#clear');
const prediction = document.querySelector('#predictsex');
const chance = document.querySelector('#prediction_number');
const savedGender = document.querySelector('#result_from_saved');
const male = document.querySelector('#male');
const female = document.querySelector('#female');
const alertbox = document.querySelector('#alert');
// window.localStorage.clear();

// save user's information
async function saving() {
    username = textbox.value
    var gender = null
    if (male.checked) {
        gender = male.value
        male.checked = false;
        var prob = 100
    } else if (female.checked) {
        gender = female.value
        female.checked = false;
        var prob = 100
    } else {
        userData = { 'name': username, "gender": prediction.innerHTML, "probability": '' }
        window.localStorage.setItem(username, JSON.stringify(userData));
        return;
    }
    content_to_save = {"name": username, "gender": gender, "probability": prob
    }
    window.localStorage.setItem(username, JSON.stringify(content_to_save));
    if (content_to_save.gender == null)
        alertbox.innerText = `The name is not in our database.`;
    else
        savedGender.innerHTML = content_to_save.gender;
}

// display saved gender
function display_saved_content(saved_userData) {
    if (saved_userData.gender == null)
        alertbox.innerText = `The name is not in our database.`;
    else
        savedGender.innerHTML = saved_userData.gender;
}

// the process of sending request and display data in webpage.
async function submitting() {
    let username = textbox.value;
    // syntax check
    if (username == "" || /^[a-z A-Z]+$/.test(username) != true) {
        alertbox.innerText = "Enter a valid name!";
        chance.innerHTML = ""
        return;
    }
    // is it in saved?
    saved_userData = await JSON.parse(window.localStorage.getItem(username));
    if (saved_userData) {
        display_saved_content(saved_userData);
        return;
    } else {
        // request
        var userData;
        try {
            let response = await fetch(`https://api.genderize.io/?name=${username}`)
            let json = await response.json();
            if (response.status == 200) {
                userData = json
            }
            handleError(json);
            userData = Promise.reject(`Request failed with error ${response.status}`);
        } catch (e) {
            console.log(e);
        }
        // process request
        if (userData.gender)
            prediction.innerHTML = userData.gender;
        else
            alertbox.innerText = `The name is not in our database.`;
        if (userData.probability)
            chance.innerHTML = userData.probability;
        else
            chance.innerHTML = '';
    }
}

// clear saved username
async function clearing() {
    let username = textbox.value;
    let userData = await JSON.parse(window.localStorage.getItem(username));
    if (userData != null) {
        window.localStorage.removeItem(username);
        savedGender.innerHTML = '';
    }
    else {
        alertbox.innerText = 'No entry to delete';
    }
}