async function add() {
    let medium = document.getElementById("medium").value;
    let category = document.getElementById("category").value;
    let title = document.getElementById("title").value;
    let year = document.getElementById("year").value;
    let description = document.getElementById("description").value;
    let poster = document.getElementById("poster").value;

    document.getElementById("medium").value = '';
    document.getElementById("category").value = '';
    document.getElementById("title").value = '';
    document.getElementById("year").value = '';
    document.getElementById("description").value = '';
    document.getElementById("poster").value = '';

    let data = {"Medium": medium, "Category": category, "Title": title, "Year": year, "Description": description, "Poster": poster};
    const res = await fetch("/gallery", {  
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