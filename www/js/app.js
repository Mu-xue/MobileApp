// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App routes
  routes: routes,
});


$$(document).on('page:init', '.page[data-name="temper"]', function (e) {
    var tempChart = echarts.init(document.getElementById('temp-chart'), 'light');
    var option = {
      title: {
        text: '昨晚温度变化',
        bottom: '0',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ['20:00', '22:00', '00:00', '02:00', '04:00', '06:00', '08:00']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [29.5, 25.2, 26.0, 26.2, 27.0, 27.0, 26.5],
        type: 'line',
        smooth: true
      }]
    };

    tempChart.setOption(option);
});

$$(document).on('page:init', '.page[data-name="electric"]', function (e) {
    var elecChart = echarts.init(document.getElementById('elec-chart'), 'light');
    var option = {
      title: {
        text: '近一周消耗电量',
        bottom: '0',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      }]
    };

    elecChart.setOption(option);
});

$$(document).on('page:init', '.page[data-name="clock"]', function (e) {
  var today = new Date();
  var picker_open = app.picker.create({
    inputEl: '#open-picker-date',
    toolbar: false,
    rotateEffect: true,
    value: [
      today.getMonth(),
      today.getDate(),
      today.getFullYear(),
      today.getHours(),
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
    ],
    formatValue: function (values, displayValues) {
      return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [
      // Months
      {
        values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
      },
      // Years
      {
        values: (function () {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) { arr.push(i); }
            return arr;
        })(),
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function () {
          var arr = [];
          for (var i = 0; i <= 23; i++) { arr.push(i); }
            return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function () {
          var arr = [];
          for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
            return arr;
        })(),
      }
    ],
    on: {
      change: function (picker, values, displayValues) {
        var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
        if (values[1] > daysInMonth) {
          picker.cols[1].setValue(daysInMonth);
        }
      },
    }
  });

   var picker_close = app.picker.create({
    inputEl: '#close-picker-date',
    toolbar: false,
    rotateEffect: true,
    value: [
      today.getMonth(),
      today.getDate(),
      today.getFullYear(),
      today.getHours(),
      today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
    ],
    formatValue: function (values, displayValues) {
      return displayValues[0] + ' ' + values[1] + ', ' + values[2] + ' ' + values[3] + ':' + values[4];
    },
    cols: [
      // Months
      {
        values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
        displayValues: ('January February March April May June July August September October November December').split(' '),
        textAlign: 'left'
      },
      // Days
      {
        values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
      },
      // Years
      {
        values: (function () {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) { arr.push(i); }
            return arr;
        })(),
      },
      // Space divider
      {
        divider: true,
        content: '  '
      },
      // Hours
      {
        values: (function () {
          var arr = [];
          for (var i = 0; i <= 23; i++) { arr.push(i); }
            return arr;
        })(),
      },
      // Divider
      {
        divider: true,
        content: ':'
      },
      // Minutes
      {
        values: (function () {
          var arr = [];
          for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
            return arr;
        })(),
      }
    ],
    on: {
      change: function (picker, values, displayValues) {
        var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
        if (values[1] > daysInMonth) {
          picker.cols[1].setValue(daysInMonth);
        }
      },
    }
  });   
});

$$(document).on('page:init', '.page[data-name="detail"]', function (e) {
  var picker_mode = app.picker.create({
    inputEl: '#mode-picker',
    cols: [
      {
        textAlign: 'center',
        values: ['制冷', '制热', '除湿', '送风']
      }
    ]
  });
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});



