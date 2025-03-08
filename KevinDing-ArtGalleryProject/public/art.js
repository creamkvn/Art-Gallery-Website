async function like() {
    let url = new URL(window.location.href);
    let id = url.pathname.toString().split("/").pop() ;
    let data ={"artId": id};
    const res = await fetch("/like", {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let responseText = await res.text()
    alert(responseText);

    window.location.href = window.location.href;
}

async function comment() {
    let url = new URL(window.location.href);
    let id = url.pathname.toString().split("/").pop();
    let a = document.getElementById("comment").value;
    let data = {"data": a, "artId": id};

    const res = await fetch("/comment", {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    let responseText = await res.text()
    alert(responseText);
    window.location.href = window.location.href;
}