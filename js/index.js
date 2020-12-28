function showDesc(id){
    descs = document.getElementsByClassName("desc")
    for (var d of descs){
        d.style.display = "none"
    }
    document.getElementById(id).style.display = "block"
}
