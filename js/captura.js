function crearPDF(){
    
    const container = document.getElementById('datosImprimir');
    var opt = {        
        filename:     'myfile.pdf',          
        jsPDF:        { orientation: 'landscape', format: 'a3', precision:16 }
      };
    html2pdf().from(container).set(opt).save();
    setTimeout(() => {
    window.location.href = "/?projectId=JBPS2";
    },3000);

}

$('#imagen').change(function() {
    if ($(this).is(':checked')) {
      $('#captura').show();
    } else {
      $('#captura').hide();
    }
  });
  $('#leyenda_espacios').change(function() {
    if ($(this).is(':checked')) {
      $('#espacios').show();
    } else {
      $('#espacios').hide();
    }
  });

  $('#leyenda_ocupacion').change(function() {
    if ($(this).is(':checked')) {
      $('#ocupacion').show();
    } else {
      $('#ocupacion').hide();
    }
  });


$('#imprimir').click(function () { 
    crearPDF();
});
