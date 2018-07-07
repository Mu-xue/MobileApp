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

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});


$$(document).on('page:reinit page:init', '.page[data-name="air"]', function (e) {
  var air_state = '';

  app.request({
      url:'http://120.78.155.180:3123/airC/V1/getPowerState',
      method: 'POST',
      crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
      data: {
       id:'01d82817-0ece'
      },
      success: function( res) {
        if (res == '0') {   //当前状态关机
          $$('#enter_bt').html('开机');
          $$('#current_state').html('关机');
          $$('#enter_bt').on('click',function(event){
            app.request({
              url:'http://120.78.155.180:3123/airC/V1/writePowerState',
              method: 'POST',
              crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
              data: {
               id:'01d82817-0ece',
               input: '1'
              },
              success: function(res){
                if(res == '1'){
                  var toastCenter = app.toast.create({
                    text: '开机成功',
                    position: 'center',
                    closeTimeout: 2000,
                  });
                  toastCenter.open();
                  $$('#enter_bt').off('click');
                  mainView.router.navigate('/detail/');
                }
              }
            });
             
          });
        }
        if (res == '1') {  //当前状态开机
          $$('#enter_bt').html('进入');
          $$('#current_state').html('开机');
          $$('#enter_bt').on('click',function(){
             mainView.router.navigate('/detail/');
          });
        }
      },
      error: function (res){
        console.log(res);
      }
  });

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
      ''+today.getFullYear(),
      ''+today.getMonth(),
      ''+today.getDate(),
      ''+today.getHours(),
      ''+ (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
    ],
    formatValue: function (values, displayValues) {
      return values[0]+'年 '+displayValues[1] + '月 ' + values[2] + '日,   ' + values[3] + ':' + values[4];
    },
    cols: [
          // Years
      {
        values: (function () {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) { arr.push(i); }
            return arr;
        })(),
      },
      // Months
      {
        values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
        displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ')
      },
      // Days
      {
        values: [01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
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
      ''+today.getFullYear(),
      ''+today.getMonth(),
      ''+today.getDate(),
      ''+today.getHours(),
      ''+ (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())
    ],
    formatValue: function (values, displayValues) {
      return values[0]+'年 '+displayValues[1] + '月 ' + values[2] + '日,   ' + values[3] + ':' + values[4];
    },
    cols: [
          // Years
      {
        values: (function () {
          var arr = [];
          for (var i = 1950; i <= 2030; i++) { arr.push(i); }
            return arr;
        })(),
      },
      // Months
      {
        values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
        displayValues: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ')
      },
      // Days
      {
        values: [01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
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

  var toggle1 = app.toggle.create({
    el: '#toggle1',
    on: {
      change: function (toggle) {
       var t =  picker_open.value;
       if(toggle.checked == true){
          date = t[0]+'-'+(parseInt((parseInt(t[1])+1)/10)>0?parseInt(t[1])+1:'0'+(parseInt(t[1])+1))+'-'+(parseInt(parseInt(t[2])/10)>0?parseInt(t[2]):'0'+parseInt(t[2]));
          time = t[3]+':'+t[4]+':00';
          console.log(date,time);
/*
        app.request({
          url:'http://120.78.155.180:3123/airC/V1/writeRunningMode',
          method: 'POST',
          crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
          data: {
           id:'01d82817-0ece',
           input: mode
          },
          success: function(res){
            if(res == '1'){
              var toastCenter = app.toast.create({
                text: '切换空调模式成功',
                position: 'center',
                closeTimeout: 2000,
              });
              toastCenter.open();
            }
          }
        });
*/
       }
      }
    }
  });
  toggle1.checked=false;
  var toggle2 = app.toggle.create({
    el: '#toggle2',
    on: {
      change: function (toggle) {
       
      }
    }
  });
  toggle2.checked=false;
});

$$(document).on('page:init page:reinit', '.page[data-name="detail"]', function (e) {
  var picker_mode = app.picker.create({
    inputEl: '#mode-picker',
    cols: [
      {
        textAlign: 'center',
        values: ['自动', '制热', '除湿','制冷', '送风']
      }
    ],
    on: {
      closed: function(picker){
        var mode = '';
        switch(picker.value[0]){
          case '自动':
            mode = '0';
            break;
          case '制热':
            mode = '1';
            break;
          case '除湿':
            mode = '2';
            break;
          case '制冷':
            mode = '3';
            break;
          case '送风':
            mode = '4';
            break;
          default:
        }
        app.request({
          url:'http://120.78.155.180:3123/airC/V1/writeRunningMode',
          method: 'POST',
          crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
          data: {
           id:'01d82817-0ece',
           input: mode
          },
          success: function(res){
            if(res == '1'){
              var toastCenter = app.toast.create({
                text: '切换空调模式成功',
                position: 'center',
                closeTimeout: 2000,
              });
              toastCenter.open();
            }
          }
        });
      }
    }
  });

  var picker_fan = app.picker.create({
    inputEl: '#fan-picker',
    cols: [
      {
        textAlign: 'center',
        values: ['自动', '低速', '中速','高速', '其他']
      }
    ],
    on: {
      closed: function(picker){
        var fan = '';
        switch(picker.value[0]){
          case '自动':
            fan = '0';
            break;
          case '低速':
            fan = '1';
            break;
          case '中速':
            fan = '2';
            break;
          case '高速':
            fan = '3';
            break;
          case '其他':
            fan = '4';
            break;
          default:
        }
        app.request({
          url:'http://120.78.155.180:3123/airC/V1/writeFanState',
          method: 'POST',
          crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
          data: {
           id:'01d82817-0ece',
           input: fan
          },
          success: function(res){
            if(res == '1'){
              var toastCenter = app.toast.create({
                text: '切换风扇模式成功',
                position: 'center',
                closeTimeout: 2000,
              });
              toastCenter.open();
            }
          }
        });
      }
    }
  });



  app.request({
    url:'http://120.78.155.180:3123/airC/V1/getRunningMode',
    method: 'POST',
    crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
    data: {
     id:'01d82817-0ece'
    },
    success: function(res){
      var mode = '';
      switch (res) {
        case '0':
          mode = '自动';
          break;
        case '1':
          mode = '制热';
          break;
        case '2':
          mode = '除湿';
          break;
        case '3':
          mode = '制冷';
          break;
        case '4':
          mode = '送风';
          break;
        default:
      }  
      $$('#mode-picker').val(mode);
    }
  });


  app.request({
    url:'http://120.78.155.180:3123/airC/V1/getFanState',
    method: 'POST',
    crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
    data: {
     id:'01d82817-0ece'
    },
    success: function(res){
      var fan = '';
      switch (res) {
        case '0':
          fan = '自动';
          break;
        case '1':
          fan = '低速';
          break;
        case '2':
          fan = '中速';
          break;
        case '3':
          fan = '高速';
          break;
        case '4':
          fan = '其他';
          break;
        default:
      }  
      $$('#fan-picker').val(fan);
    }
  });

  var range = app.range.get('.range-slider');
  var rotate = 'rotate('
  var translateY = 'deg) translateY(-75px)'

  app.request({
    url:'http://120.78.155.180:3123/airC/V1/getSettingTemp',
    method: 'POST',
    crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
    data: {
     id:'01d82817-0ece'
    },
    success: function(res){
      var value = parseInt(res);
      $$('#temp_dot').css("transform", rotate + (value-20)*33 + translateY);
      $$('#temp_value').html(value+'°');
    }
  });

  $$('#current_temp').on('range:change', function (e, range) {
    $$('#temp_dot').css("transform", rotate + (range.value-20)*33 + translateY);
    $$('#temp_value').html(range.value+'°');
    app.request({
      url:'http://120.78.155.180:3123/airC/V1/writeSettingTemp',
      method: 'POST',
      crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
      data: {
       id:'01d82817-0ece',
       input: range.value
      },
      success: function(res){
        console.log('调温成功');
      }
    });
  });

  $$('#close_bt').on('click', function(event) {
    app.request({
      url:'http://120.78.155.180:3123/airC/V1/writePowerState',
      method: 'POST',
      crossDomain: true,//这个一定要设置成true，默认是false，true是跨域请求。
      data: {
       id:'01d82817-0ece',
       input: '0'
      },
      success: function(res){
        if(res == '1'){
          var toastCenter = app.toast.create({
            text: '关机成功',
            position: 'center',
            closeTimeout: 2000,
          });
          toastCenter.open();
          mainView.router.navigate('/main/');
        }
      }
    });
  });
});






