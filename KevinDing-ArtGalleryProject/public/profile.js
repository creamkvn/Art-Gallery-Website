async function del(id) {
    let data = {"_id": id};
    const res = await fetch("/like", {  
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let responseText = await res.text()
    alert(responseText);

    window.location.href = window.location.href;
}

async function switchAcc(){
    let data = []
    const res = await fetch("/switchAcc", {  
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let responseText = await res.text()
    alert(responseText);
    if(res.ok){
        window.location.href = window.location.href;
    }else{
        window.location.href = "/addGallery";
    }

}

async function logout(){
    let data = []
    const res = await fetch("/logout", {  
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let responseText = await res.text()
    alert(responseText);
    if(res.ok){
        window.location.href = "/";
    }else{
        window.location.href = window.location.href;
    }
}

async function unfollow(id){
    let data ={"_id": id};
    const res = await fetch("/follow", {  
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let responseText = await res.text()
    alert(responseText);
    window.location.href = window.location.href;
}