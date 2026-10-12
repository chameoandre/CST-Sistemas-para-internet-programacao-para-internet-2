$(document).ready(function () {
            $('#form-cadastro').on('submit', function (e) {
                e.preventDefault();
                const nome = $('#input-nome').val();
                const email = $('#input-email').val();

                $('#caixa-mensagem').html(`Lido: <strong>${nome}</strong> (${email})`);
                $('#caixa-mensagem').css("background-color", "yellow");
            });




        });