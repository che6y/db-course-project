jQuery(function($) {
    
    if ( location.pathname.split("/")[1] !== "" ) {
        $('.nav-menu a[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active');
    }
    
    const datepickerConfig = {
        dateFormat: "yy-mm-dd",
        changeYear: true,
        changeMonth: true,
        maxDate: new Date(),
        yearRange: "1990:" + new Date().getFullYear()
    };
    
    $('#new-item-employment-date').datepicker(datepickerConfig);
    
    $('#new-item-dismissal-date').datepicker(datepickerConfig);
    
});