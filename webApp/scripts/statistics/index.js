$(function () {
    let gamesDatatableOptions = {
        order: [[2, "asc"], [3, "desc"], [4, "asc"], [6, "asc"]],
        orderFixed: [0, "asc" ],
        columnDefs: [
            { targets: "disableOrdering", orderable: false },
            { type: "num", targets: [2, 3, 4] },
            { targets: 0, render: (val) => getModeTitle(val),  },
            { type: "num", targets: [5, 6], render: (val, type) => {
                if(type === 'display') {
                    return moment.utc(parseInt(val)).format(standardTimeFormat);
                }

                return val;

             }},
        ],
        rowGroup: {
            dataSrc: "gameMode",
            endRender: null,
            startRender: ( _, mode) => getModeTitle(mode)
        },
        columns: [
            { data: "gameMode" },
            { data: "nickname" },
            { data: "mistakesCounter" },
            { data: "correctCounter" },
            { data: "missedCounter" },
            { data: "totalTimeMillis" },
            { data: "correctDelayMillisCounter" },
        ]
    };

    let currentPlayerId = $("input[name=\"currentPlayerId\"]").val();

    let bestGamesDatatableOptions = $.extend(true, {}, gamesDatatableOptions, {
        lengthMenu: [3, 10, 25, 50],
    });

    let playerGamesDatatableOptions = $.extend(true, {}, gamesDatatableOptions, {
        data: [],
    });

    let bestGamesTable = $(".table.best-games-table");
    let playerGamesTable = $(".table.player-games-table");

    initDatatable(bestGamesTable, bestGamesDatatableOptions);
    initDatatable(playerGamesTable, playerGamesDatatableOptions);

    const loadData = () => {
        $.ajax({
            url: "/statistics/data",
            method: "GET",
            dataType: "json",
            success: (data) => {
                bestGamesTable.DataTable().clear().rows.add(data).draw();
                playerGamesTable.DataTable().clear().rows.add(data.filter(r => r.playerId === currentPlayerId)).draw();
            }
        });
    };

    loadData();
    setInterval(loadData, 30 * 1000);
});