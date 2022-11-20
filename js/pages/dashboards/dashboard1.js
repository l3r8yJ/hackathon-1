$(function () {
    "use strict";
    let cache;
    const cacheRequest = async () => {
        const response = await axios.get("http://127.0.0.1:8282/usage");
        return response;
    };
    const procRequest = async () => {
        const response = await axios.get("http://127.0.0.1:8282/processes");
        return response;
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
            time.hour = 0;
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
        cacheRequest().then((res)=>{
            let data = res.data;
            if (seriesCpu.length === 12 && seriesMem === 12)
            {
                seriesMem.shift();
                seriesCpu.shift();
            }
            seriesCpu.push(Math.round(data.global_cpu_usage));
            seriesMem.push(data.global_mem / (4*Math.pow(10, 9)));
            $('#global-mem').text(Math.abs(Math.round(data.global_mem / (4*Math.pow(10, 9)))) + '%');
            $('#cpu-usage').text(Math.round(data.global_cpu_usage)+ '%');
        });
        procRequest().then((res) => {
            $('#proc-table').children('tr').remove();
            res = res.data.split('}');
            for (let i = 0; i < 10; i++)
            {
                res[i] += '}';
                let data = JSON.parse(res[i]);
                let date = new Date(data.start_time * 1000);
                let hour = date.getHours() < 10 ? "0"+date.getHours() : date.getHours();
                let min = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes();
                let sec = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds();
                date = date.getFullYear() + " " + date.getMonth() + " " + date.getDate()
                    + " " + hour + ":" + min + ":" + sec;
                $('#proc-table').append('<tr>' + '<td>' + (i + 1) + '</td>' + '<td class="txt-oflo">' + data.name + '</td>'
                    + '<td>' + data.pid + '</td>' + '<td>' +  date + '</td>' + '<td>' + data.status + '</td>'
                    + '<td>' + data.cpu_usage + '</td>' + '<td>' + data.mem / (4*Math.pow(10, 9)) + '%' + '</td>' + '</tr>');
            }
        })
    }
    updateSeries();
    setInterval(updateSeries, 5000);

    //ct-visits
    var createChartist = function() {
        new Chartist.Line('#ct-processes', {
                labels: labels,
                series: [
                    seriesMem,
                    seriesCpu
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
                        return value + '%';
                    }
                },
                showArea: true
            });
    }

    var chart = [chart];

    var sparklineLogin = function () {
        $('#sparklinedash').sparkline([1], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#7ace4c'
        });
        $('#sparklinedash2').sparkline(seriesMem, {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#7460ee'
        });
        $('#sparklinedash3').sparkline(seriesCpu, {
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


