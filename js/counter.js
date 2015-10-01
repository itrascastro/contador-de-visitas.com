window.LastCheckedRadioId = 0;

$(function()
{
    $('#select1').change(
        function()
        {
            if ($(this).val() == 'view_all') {
                window.open('http://contador-de-visitas.com/estilos-contador.htm', '_self');
            } else {
                $('#preview').attr('src','images/digits' + $(this).val() + '/preview.png');
            }
        }
    );
    $('.previewImage').click(
        function()
        {
            var id = $(this).attr('id').substring(5);
            var radioId = '#radio' + id;
            var lastChecked = '#radio' + window.LastCheckedRadioId;

            $(lastChecked).prop('checked', false);
            $(radioId).prop('checked', true);

            window.LastCheckedRadioId = id;
        }
    );
    $('#counterCode').focus(function() {
        select_all();
    });
    $('#selectAllLink').click(function() {
        select_all();
    });

});

function select_all()
{
    var $this = $('#counterCode');
    $this.select();

    // Work around Chrome's little problem
    $this.mouseup(function() {
        // Prevent further mouseup intervention
        $this.unbind("mouseup");
        return false;
    });
}

