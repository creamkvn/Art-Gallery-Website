async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let userData = {"username": username, "password": password};

    const res = await fetch("/user", {  
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })

    let responseText = await res.text()
    alert(responseText);
    if(res.ok){
        window.location.href = "/profile";
    }
}