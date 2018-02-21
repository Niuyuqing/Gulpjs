//var $ = require('./lib/jquery.min');
require('./lib/bootstrap.min');
require('./lib/bootstrap-datetimepicker.min');

$('#datetimepicker').datetimepicker({
    format: 'yyyy-mm-dd'
});