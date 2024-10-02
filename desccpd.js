function formatNumber(number) {
    // Convierte el número a string y utiliza una expresión regular para agregar separadores de miles
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


function calculateDiscount() {

    const amount = parseFloat(document.getElementById('amount').value);
    const expiryDate = new Date(document.getElementById('expiry-date').value);
    const tna = parseFloat(document.getElementById('tnr').value);

    // Arancel ALYC y Comisión SGR fijos
    const arancelAlycPercent = 1.20 / 100;
    const comisionSGRPercent = 3.25 / 100;

    // Verificaciones
    if (isNaN(amount) || isNaN(tna) || !expiryDate.getTime()) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    if (tna > 99) {
        alert('La tasa TNA no puede ser mayor al 99%.');
        return;
    }

    const today = new Date();
    const maxExpiryDate = new Date(today);
    maxExpiryDate.setDate(today.getDate() + 360);

    if (expiryDate > maxExpiryDate) {
        alert('La fecha de vencimiento no puede exceder los 360 días a partir de hoy.');
        return;
    }

    const timeDiff = expiryDate - today;
    let daysToExpiry = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 2; // Sumar 2 días

    if (daysToExpiry > 360) {
        daysToExpiry = 360;
    }

    if (daysToExpiry <= 0) {
        alert('La fecha de vencimiento debe ser en el futuro.');
        return;
    }

    //ampliar el contenedor .form-container-result para poder mostrar el resultado
    const containerResult = document.getElementById("form-container-result");
    containerResult.style.height = "auto";
    containerResult.style.display = "block";

    const textoNeto = document.getElementById("texto-neto");
    textoNeto.style.display = "block";

    // Calcular descuento
    const discount = parseFloat(amount - (amount / (1 + (tna / 100 * ((daysToExpiry + 2) / 365))))).toFixed(0);
    const amountAfterDiscount = parseFloat(amount - discount).toFixed(0);

    // Calcular monto ponderado en el plazo
    const adjustedAmount = (amount / (1 + (tna / 100 * (daysToExpiry / 365)))).toFixed(0);

    // Calcular arancel ALYC con IVA
    const arancelAmount = ((1.15 / 100 / 365) * (daysToExpiry) * amount * 1.21).toFixed(0);

    // Calcular comisión SGR
    const comisionAmount = ((amount * daysToExpiry * comisionSGRPercent) / 365).toFixed(0);

    // Calcular monto neto después de aplicar el descuento, arancel y comisión
    const netAmount = (amountAfterDiscount - parseFloat(arancelAmount) - parseFloat(comisionAmount)).toFixed(0);


    // Calcular Costo Financiero Total (CFT)
    const cft = (((amount - netAmount) / netAmount) * 100).toFixed(2);

    // Calcular CFT Anualizado
    const cftAnual = ((cft / daysToExpiry) * 365).toFixed(2);



    document.getElementById('result').innerHTML = `
        <div class="net-amount">Neto liquidado: $${formatNumber(netAmount)}</div>
         <div class="chqamount">Monto del cheque: $${formatNumber(amount)}</div>              
        <div class="discount">Descuento (tasa): $${formatNumber(discount)}</div>
        <div class="arancel">Aranceles del mercado: $${formatNumber(arancelAmount)}</div>
        <div class="comision">Comisión SGR: $${formatNumber(comisionAmount)}</div>
        <div class="cft">CFT: ${cft}%</div>
        <div class="cft-anual">CFT (anual): ${cftAnual}%</div>
    `;
}

/*  document.getElementById('refreshButton').addEventListener('click', function () {
     location.reload();
 }); */