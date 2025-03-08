async function addworkshop() {
    let name = document.getElementById("workshopnname").value;
    let description = document.getElementById("description").value;

    document.getElementById("workshopnname").value = '';
    document.getElementById("description").value = '';

    let data = {"name": name, "description": description};
    const res = await fetch("/workshop", {  
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