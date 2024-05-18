/*here we have everything related to the login page...*/

//get the error message element...
const errorMessage = document.querySelector('.cont_error'); 

//verify if the error message exits...
if(errorMessage){
    setTimeout(function(){
        errorMessage.style.display = 'none';
    }, 5000);
}

//get the button...
const buttonViewable1 = document.getElementById('view_btn_1');
const buttonViewable2 = document.getElementById('view_btn_2');
//get the password input...
const passInput = document.querySelector('.password_input');
const passInput2 = document.querySelector('.password_input_conf');

buttonViewable1.addEventListener('click', (e) => {
    e.preventDefault();
    if(passInput.type === 'password'){
        passInput.type = 'text';
        buttonViewable1.innerHTML = `<i class='bx bxs-hide'></i> Ocultar Contraseña`;
    } else{
        passInput.type = 'password';
        buttonViewable1.innerHTML = `<i class='bx bxs-face'></i> Ver contraseña`;
    }
})

if(buttonViewable2){
    buttonViewable2.addEventListener('click', (e) => {
        e.preventDefault();
        if(passInput2.type === 'password'){
            passInput2.type = 'text';
            buttonViewable2.innerHTML = `<i class='bx bxs-hide'></i> Ocultar Contraseña`;
        } else{
            passInput2.type = 'password';
            buttonViewable2.innerHTML = `<i class='bx bxs-face'></i> Ver contraseña`;
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            document.cookie = `token=${data.token}; expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/`;
            window.location.href = '/'; // Redirect to home page after successful login
        } else {
            // we take the element alert...
            const alertElement = document.getElementById('alert');
            // we take the original text...
            const originalText = alertElement.innerText; 
            // we send the error message...
            alertElement.innerText = data.message; 
            setTimeout(() => {
                // we reassing the original text...
                alertElement.innerText = originalText; 
            }, 2000);
        }
    });
});