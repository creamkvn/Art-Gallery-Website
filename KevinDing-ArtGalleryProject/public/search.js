async function search() {
    let medium = document.getElementById("medium").value;
    let category = document.getElementById("category").value;
    document.getElementById("medium").value = '';
    document.getElementById("category").value = '';

    let postData = {};

    if (medium != '') {
        postData.Medium = medium;
    } 

    if (category != '') {
        postData.Category = category;
    }

    const res = await fetch("/search", {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })

    
    if(res.ok){
        let searchResult = await res.json();
        console.log(searchResult);
        let result = '';
        for (let art in searchResult) {
            console.log(art)
            result += `<a href = "/gallery/${searchResult[art]._id}">${searchResult[art].Title}</a>`;
        }
        console.log(result)
        document.getElementById("result").innerHTML = result;
    } else {
        let text = await res.text();
        alert(text);
    }
}