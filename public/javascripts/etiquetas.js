"use strict"

function guardamos() {
    let aux = $(".textoEtiqueta").val().trim();
    let etiqueta = "@" + $(this).text().trim();
    let repetida = false;

    let arrayEtiquetas = $(".textoEtiqueta").val().trim().split("@");
    arrayEtiquetas.forEach(e => {
        if(e === $(this).text().trim())
            repetida = true;
    });

    if(!repetida)
        $(".textoEtiqueta").val(aux + etiqueta);
}

$(function() {
    $(".etiqjquery").on("click", guardamos);
})