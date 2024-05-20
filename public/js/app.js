// burger menu icon
const burgerMenu = document.getElementById('menuBurger'); 
// this is the drop down menu... 
const ddMenu = document.getElementById('dropDownMenu');
// X icon
const bm = document.getElementById('bm');

burgerMenu.addEventListener('click', () => {
    // if the icon is the burger menu we change from none to flex
    if (bm.classList.contains('bx-menu')) {
        ddMenu.style.display = 'flex';
        bm.classList.replace('bx-menu', 'bx-x');

    } else { // if the icon is the X we change from flex to none again
        ddMenu.style.display = 'none';
        bm.classList.replace('bx-x', 'bx-menu');
    }
});

// this function helps us to change the name of the label of the page depending on the route
const routes = () => {
    // we take the current route
    const currentPage = window.location.pathname; 
    // label page...
    const labelPage = document.getElementById('pageIdentifier');

    // this array contains the name of the page, corresponding to the path...
    const AllPagesIdentifier = ['Home', 'Balance', 'My information']; 

    // in this switch we make the corresponding assignment...
    switch(currentPage){
        case '/user/': 
            labelPage.innerText = AllPagesIdentifier[0];
        break;
        case '/user/balance': 
            labelPage.innerText = AllPagesIdentifier[1];
        break; 
        case '/user/details': 
            labelPage.innerText = AllPagesIdentifier[2];
        break;
    }
}
// we call the function...
routes();

async function logout() {
    const res = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (res.ok) {
        // delete all client's info...
        localStorage.removeItem('token');
        window.location.href = '/'; // redirection
    } else {
        alert('Error al cerrar sesión');
    }
}

// this function helps us to close the form "basic info"
const btnBI = document.getElementById("formBI_btn");
const sectionFormBI = document.getElementById("updateBasicInfo");
const btnOpenBI = document.getElementById("updateInfo_btn");

// function to close the form basic info...
const closeFormBI = (e) => {
    e.preventDefault();
    sectionFormBI.style.display = 'none';
}

// functon to open the form Basic info
const openFormBI = (e) => {
    e.preventDefault();
    sectionFormBI.style.display = 'flex';
}

btnOpenBI.addEventListener('click', (event) => openFormBI(event));
btnBI.addEventListener('click', (event) => closeFormBI(event));

// this part helps us to open the form "change password"
const openFormCPbtn = document.getElementById("cp_btn"); 
const sectionFormCP = document.getElementById("changePassword");
const closeFormaCPbtn = document.getElementById("formCP_btn");

const closeFormCP = (e) => {
    e.preventDefault();
    sectionFormCP.style.display = 'none';
}

// functon to open the form Basic info
const openFormCP = (e) => {
    e.preventDefault();
    sectionFormCP.style.display = 'flex';
}

closeFormaCPbtn.addEventListener('click', (event) => closeFormCP(event));
openFormCPbtn.addEventListener('click', (event) => openFormCP(event));


/*in this section we can see the code necessary to validate the inputs, 
change the password and edit the information to send it to the database...*/

// button to see the passwords...
const btnSeePass = document.querySelector("#iconToSeePass button");
const inputs = sectionFormCP.querySelectorAll("form input");

const throughInputs = (e) => {
    e.preventDefault();
    inputs.forEach(input => {
        if (input.type === 'password') {
            input.type = "text";
        } else {
            if(input.name !== 'send'){
                input.type = "password";
            }
        }
    });
}

btnSeePass.addEventListener('click', (event) => throughInputs(event));

// Select the relevant input elements
const newPassInput = document.getElementById('newPass');
const confirmPassInput = document.getElementById('ConfirPass');
const confirmPassLabel = document.getElementById('confirmPassLabel');
const btnSendPC = document.getElementById('update2');

// Function to check if the new password and confirm password match
function validatePasswords() {
    if (newPassInput.value !== confirmPassInput.value) {
        confirmPassLabel.textContent = "Does not match";
        confirmPassLabel.style.color = "red";
        confirmPassInput.style.backgroundColor = "red";
        btnSendPC.style.display = 'none';
    } else {
        confirmPassLabel.textContent = "Confirm new password";
        confirmPassLabel.style.color = "";
        confirmPassInput.style.backgroundColor = "";
        btnSendPC.style.display = "";
    }
}

// Add event listeners to the input fields
confirmPassInput.addEventListener('blur', validatePasswords);

// Get the form element by its ID
const changePasswordForm = document.getElementById('changePasswordForm');

// Add an event listener for the form's submit event
changePasswordForm.addEventListener('submit', async (event) => {
    // Prevent the form from submitting the traditional way
    event.preventDefault();

    // Get the values of the input fields
    const oldPassword = document.getElementById('oldPass').value;
    const newPassword = document.getElementById('newPass').value;
    const titleMessage = document.querySelector('#titleF span');
    
    // Send a PUT request to the server with the old and new passwords
    const response = await fetch('/user/password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        // Convert the passwords to a JSON string for the request body
        body: JSON.stringify({ oldPassword, newPassword })
    });

    // Parse the response from the server
    const data = await response.json();

    // Check if the response is OK (status code 200-299)
    if (response.ok) {
        // If the password was updated successfully, show a success message
        titleMessage.innerText = 'Password updated successfully';
        setTimeout(() => {
            titleMessage.innerText = 'Change your password';
            sectionFormCP.style.display = 'none';
        }, 1500);
    } else {
        // If there was an error, show the error message from the server
        alert(data.message);
        titleMessage.innerText = data.message;
        setTimeout(() => {
            titleMessage.innerText = 'Change your password';
        }, 1500);
    }
});

// validation of the basic info form...
const updateForm = document.querySelector('#updateBasicInfoForm');
const inputBIForm = updateForm.querySelectorAll("input");
const btUpdateBI = document.getElementById("update");

// regular Expresions...
const reg = {
    names: /^[A-Za-z\s]+$/,
    phone: /^\+\d{1,3}\s\(\d{3}\)\s\d{3}-\d{4}$/, 
    age:/^(?:100|[1-9][0-9]?)$/
};

/*this function, inside which there is a switch, helps 
us to see the name of the input and do the corresponding validation */
const checkPoint = (e) => {
    switch(e.name){
        case 'name': 
            if(!reg.names.test(e.value.trim())){
                document.getElementById("name").style.backgroundColor = 'red'; 
                document.getElementById("lblName").style.color = 'red';
                document.getElementById("lblName").innerText = 'Invalid Name';

                return false;
            } else{
                document.getElementById("name").style.backgroundColor = ''; 
                document.getElementById("lblName").style.color = '';
                document.getElementById("lblName").innerText = 'Name';

                return true; 
            }
        case 'last': 
            if(!reg.names.test(e.value.trim())){
                document.getElementById("last").style.backgroundColor = 'red'; 
                document.getElementById("lblLast").style.color = 'red';
                document.getElementById("lblLast").innerText = 'Invalid Last Name';

                return false;
            } else{
                document.getElementById("last").style.backgroundColor = ''; 
                document.getElementById("lblLast").style.color = '';
                document.getElementById("lblLast").innerText = 'Last';

                return true; 
            }
        case 'age': 
            if(!reg.age.test(e.value.trim())){
                document.getElementById("age").style.backgroundColor = 'red'; 
                document.getElementById("lblAge").style.color = 'red';
                document.getElementById("lblAge").innerText = 'Invalid Age';

                return false;
            } else{
                document.getElementById("age").style.backgroundColor = ''; 
                document.getElementById("lblAge").style.color = '';
                document.getElementById("lblAge").innerText = 'Age';

                return true; 
            }
        case 'eye': 
            if(!reg.names.test(e.value.trim())){
                document.getElementById("eye").style.backgroundColor = 'red'; 
                document.getElementById("lblEye").style.color = 'red';
                document.getElementById("lblEye").innerText = 'Invalid Eye Color';

                return false;
            } else{
                document.getElementById("eye").style.backgroundColor = ''; 
                document.getElementById("lblEye").style.color = '';
                document.getElementById("lblEye").innerText = 'Eye Color';

                return true; 
            }
        case 'phone': 
            if(!reg.phone.test(e.value.trim())){
                document.getElementById("phone").style.backgroundColor = 'red'; 
                document.getElementById("lblPhone").style.color = 'red';
                document.getElementById("lblPhone").innerText = 'Invalid Phone';

                return false;
            } else{
                document.getElementById("phone").style.backgroundColor = ''; 
                document.getElementById("lblPhone").style.color = '';
                document.getElementById("lblPhone").innerText = 'Phone';

                return true; 
            }
    }
}

// validation is activated here
const validation = () => {
    let flag = [];
    inputBIForm.forEach(input => {
        // check if the format is correct or not..
        const bool = checkPoint(input);
        // save the boolean that is returnet to us...
        flag.push(bool);
    });

    // we verify how many falses there are
    let falseCount = 0;
    flag.forEach(value => {
        if (value === false) {
            falseCount++;
        }
    });

    // if there are no falses, we return true 
    if(falseCount <= 0){
        btUpdateBI.style.display = 'block';
        return true;
    } else{ // if there are falses, we return false 
        btUpdateBI.style.display = 'none';
        return false;
    }
}

inputBIForm.forEach(input => {
    input.addEventListener('blur', validation);
})

// here we have the code to update the basic info...
// Select the form element with the ID 'updateBasicInfo'
const titleBIForm = document.querySelector("#titleForm span");

// Add an event listener for the 'submit' event on the form
updateForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the values of the form fields
    const name = document.getElementById('name').value;
    const last = document.getElementById('last').value;
    const age = document.getElementById('age').value;
    const eyeColor = document.getElementById('eye').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const company = document.getElementById('company').value;

    const performProcess = validation();

    if(performProcess){
        try {
            // Send the form data to the server using a PUT request
            const response = await fetch('/user/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: { 
                        first: name, 
                        last: last 
                    }, 
                    age, 
                    eyeColor, 
                    phone, 
                    email, 
                    address, 
                    company 
                })
            });
    
            // Parse the server response as JSON
            const data = await response.json();
    
            // Check if the request was successful
            if (response.ok) {
                titleBIForm.innerText = 'User details updated successfully';
                setTimeout(() => {
                    titleBIForm.innerText = 'Update Your Basic Information';
                    sectionFormBI.style.display = 'none';
                    location.reload();
                }, 1500);
            } else {
                titleBIForm.innerText = data.message;
                setTimeout(() => {
                    titleBIForm.innerText = 'Update Your Basic Information';
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating user details:', error);
            alert('An error occurred while updating user details');
        }
    }
});