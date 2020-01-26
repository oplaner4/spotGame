var ww = $(window);
var standardDateFormat = 'DD.MM.YYYY HH:mm';

$.fn.dataTable.ext.type.order['momentDate-pre'] = function (data) {
    return moment(data, standardDateFormat).toDate().getTime();
};

var standardTimeFormat = 'HH:mm:ss';

$.fn.dataTable.ext.type.order['momentTime-pre'] = function (data) {
    return moment.duration(data, standardTimeFormat);
};

function initDatatable(table, extendSettings) {
    var dt = table.DataTable($.extend(true, {
        fixedHeader: true,
        language: {
            "sEmptyTable": "Tabulka neobsahuje žádná data",
            "sInfo": "Zobrazuji _START_ až _END_ z celkem _TOTAL_ záznamů",
            "sInfoEmpty": "Zobrazuji 0 až 0 z 0 záznamů",
            "sInfoFiltered": "(filtrováno z celkem _MAX_ záznamů)",
            "sInfoPostFix": "",
            "sInfoThousands": " ",
            "sLengthMenu": "Zobraz záznamů _MENU_",
            "sLoadingRecords": "Načítám...",
            "sProcessing": "Provádím...",
            "sSearch": "Hledat:",
            "sZeroRecords": "Žádné záznamy nebyly nalezeny",
            "oPaginate": {
                "sFirst": "První",
                "sLast": "Poslední",
                "sNext": "Další",
                "sPrevious": "Předchozí"
            },
            "oAria": {
                "sSortAscending": ": aktivujte pro řazení sloupce vzestupně",
                "sSortDescending": ": aktivujte pro řazení sloupce sestupně"
            }
        }
    }, extendSettings));

    var checkFixedHeaderVisibility = function () {
        var m = media();
        if (m.lg || m.xlg) {
            dt.fixedHeader.enable();
        }
        else {
            dt.fixedHeader.disable();
        }
    };

    var resizeTimeout = null;
    $(window).resize(function () {
        this.clearTimeout(resizeTimeout);
        resizeTimeout = this.setTimeout(function () {
            checkFixedHeaderVisibility();
        }, 250);
    }).trigger('resize');

    dt.on('draw.dt', function () {
        checkFixedHeaderVisibility();
    });

    return dt;
}

$(document).ready(function () {
    var header = $(".header");
    var upto = $(".upto");

    $(document).tooltip({
        selector: '[title]',
        placement: 'bottom',
        offset: 0,
        trigger: 'hover'
    }).on('click focus','[title]', function (e) {
        $(e.currentTarget).tooltip('hide');
    });
    

    upto.on('click', function () {
        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 800);
    });
 

    ww.on('scroll', function () {
        if ($(this).scrollTop() > header.innerHeight()) upto.fadeIn(150);
        else upto.fadeOut(150);
    }).trigger('scroll').trigger('resize');


    if ($('input[name="skipHeader"]').val() === '1') {
        var m = media();
        if (m.lg || m.xlg) {
            headerPageNavigator.trigger('click', [0]);
        }
    }


    $(document).on('click', function (event) {
        $(event.target).closest(".navbar").length || $(".navbar-collapse.show").length && $(".navbar-collapse.show").collapse("hide");
    });

    $('.collapse').on('hide.bs.collapse show.bs.collapse', function () {
        var icon = $('i.fa.fa-angle-down, i.fa.fa-angle-up', $('[data-target=".collapse#' + this.id + '"]'));
        if (icon.hasClass('fa-angle-up')) {
            icon.addClass('fa-angle-down').removeClass('fa-angle-up');
        }
        else {
            icon.addClass('fa-angle-up').removeClass('fa-angle-down');
        }
    });


    var confirmModal = $('.modal.modal-confirm');

    window.initAndDisplayModalConfirm = function (confirmUrl, confirmText) {
        $('.modal-body', confirmModal).text(confirmText);
        $('.btn-ok', confirmModal).attr('href', confirmUrl);
        confirmModal.modal('show');
    };

    $('[data-confirm]').on('click', function (e) {
        var $this = $(this);
        window.initAndDisplayModalConfirm($this.attr('href'), $this.data('confirm-text'));
        e.preventDefault();
        return false;
    });

});   // do not delete