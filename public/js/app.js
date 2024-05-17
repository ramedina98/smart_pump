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