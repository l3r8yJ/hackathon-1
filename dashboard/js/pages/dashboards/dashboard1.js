/*
Template Name: Admin Pro Admin
Author: Wrappixel
Email: niravjoshi87@gmail.com
File: js
*/
$(function () {
    "use strict";
    // ============================================================== 
    // Newsletter
    // ============================================================== 

    //ct-visits
    new Chartist.Line('#ct-processes', {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', ''],
        series: [
            [51, 23, 70, 79, 81, 100, 100, 91, 40]
            , [10, 56, 34, 65, 23, 34, 23, 46, 24]
        ]
    }, {
        top: 0,
        low: 1,
        showPoint: true,
        fullWidth: true,
        plugins: [
            Chartist.plugins.tooltip()
        ],
        axisY: {
            labelInterpolationFnc: function (value) {
                return (value / 1) + '%';
            }
        },
        showArea: true
    });


    var chart = [chart];

    var sparklineLogin = function () {
        $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#7ace4c'
        });
        $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#7460ee'
        });
        $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#11a0f8'
        });
        $('#sparklinedash4').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#f33155'
        });
    }
    var sparkResize;
    $(window).on("resize", function (e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();
});


