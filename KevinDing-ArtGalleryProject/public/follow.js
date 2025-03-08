async function follow(){
    let url = new URL(window.location.href);
    let id = url.pathname.toString().split("/").pop() ;
    let data ={"_id": id};
    const res = await fetch("/follow", {  
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let responseText = await res.text()
    alert(responseText);
    window.location.href = window.location.href;

}