$(document).ready(function () {
    // Manejador de eventos para el clic en el botón "Finalizar Compra"
    $('#finalizar-compra-btn').on('click', function () {
        $.ajax({
            type: 'POST',
            url: '/finalizar-compra', // Ruta en el servidor para finalizar la compra
            success: function (response) {
                // La solicitud se completó con éxito
                console.log(response.message);
                // Redirige al usuario a la página de confirmación de compra
                window.location.href = '/completado?id=' + response.OrderId;
            },
            error: function (error) {
                // Manejo de errores si la solicitud falla
                console.error(error);
            }
        });
    });
});
