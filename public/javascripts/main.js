jQuery(function($) {
    
    if ( location.pathname.split("/")[1] !== "" ) {
        $('.nav-menu a[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active');
    }
});