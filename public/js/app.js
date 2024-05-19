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


const routes = () => {
    // we take the current route
    const currentPage = window.location.pathname; 
    // label page...
    const labelPage = document.getElementById('pageIdentifier');

    // this array contains the name of the page, corresponding to the path...
    const AllPagesIdentifier = ['Home', 'Balance', 'Me info']; 

    // in this switch we make the corresponding assignment...
    switch(currentPage){
        case '/user/': 
            labelPage.innerText = AllPagesIdentifier[0];
        break;
        case '/user/balance': 
            labelPage.innerText = AllPagesIdentifier[1];
        break; 
        case '/user/me': 
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
        window.location.href = '/login'; // redirection
    } else {
        alert('Error al cerrar sesión');
    }
}