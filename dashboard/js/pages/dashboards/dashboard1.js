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
    var labels = [];
    var hour = 1;
    var updateTime = function() {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        labels = [];
        for (var i = 0; i < 60; i += 5)
        {
            var sec = i;
            if (sec < 10)
                sec = '0' + sec;
            labels.push(hour + ":" + min + ":" + sec);
        }
    };
    updateTime();
    console.log(labels);
    setInterval(updateTime, 60000);
    //ct-visits
    var createChartist = function() {
        new Chartist.Line('#ct-processes', {
                labels: labels,
                series: [
                    [0, 10, 26, 25, 44, 10, 34, 12, 10, 26, 25, 44, 10],
                     [0, 13, 37, 42, 67, 23, 74, 45, 20, 56, 35, 64, 23]
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
    }
    setInterval(createChartist, 60000);
     createChartist();

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


