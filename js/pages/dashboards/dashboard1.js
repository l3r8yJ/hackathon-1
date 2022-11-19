$(function () {
    "use strict";

    const cache = async () => {
        const request = await axios.get("/login");
        // do something with the response
      };
    var labels = [];
    var seriesCpu = [];
    var seriesMem = [];
    function handleTime(time)
    {
        if (time.sec >= 60)
        {
            time.sec = time.sec - 60;
            time.min++;
        }
        if (time.min >= 60)
        {
            time.min = time.min - 60;
            time.hour++;
        }
        if (time.hour == 24)
        {
            hour = 0;
        }
        time.sec = time.sec < 10 ? ("0" + time.sec) : time.sec;
        time.min = time.min < 10 ? ("0" + time.min) : time.min;
        time.hour = time.hour < 10 ? ("0" + time.hour) : time.hour;
    }
    var startTime = function() {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        for (var i = 0; i < 12; i++)
        {
            let time = {
                        sec: sec,
                        min: min,
                        hour: hour,
            }
            sec = Number(time.sec) + 5;
            time.sec = sec;
            handleTime(time);
            labels.push(time.hour + ":" + time.min + ":" + time.sec);
        }
    }
    var updateTime = function() {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        let lastTimeDate = new Date();
        let lastTime = labels[labels.length - 1].split(':');
        lastTimeDate.setHours(lastTime[0], lastTime[1], lastTime[2]);
        if (date > lastTimeDate)
        {
            labels.shift();
            let time = {
                hour: hour,
                min: min,
                sec: sec,
            }
            handleTime(time);
            labels.push(time.hour + ":" + time.min + ":" + time.sec);
        }
    };

    var updateSeries = function() {

    }

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

    startTime();
    updateTime();
    setInterval(updateTime, 5000);
    setInterval(createChartist, 5000);
    createChartist();
    var sparkResize;
    $(window).on("resize", function (e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();
});


