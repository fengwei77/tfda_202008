$(function(){
    $.fatNav();

    $(".pagination > .look-btn").on("mouseenter", function(){
        $(".look-reel").addClass('look-reel-swing');
        console.log('in');
    });

    $(".pagination > .look-btn").on("mouseleave", function(){
        $(".look-reel").removeClass('look-reel-swing');
        console.log('out');
    });

    $(".pagination > .start-btn").on("mouseenter", function(){
        $(".ok-man-go").addClass('ok-man-jump');
        console.log('in');
    });

    $(".pagination > .start-btn").on("mouseleave", function(){
        $(".ok-man-go").removeClass('ok-man-jump');
        console.log('out');
    });
});
