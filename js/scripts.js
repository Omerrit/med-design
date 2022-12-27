window.addEventListener('DOMContentLoaded', event => {

    // hexagon bitmap
    // draw(document.getElementById('canvas-left-top'));
    // draw(document.getElementById('canvas-right-top'));
    // draw(document.getElementById('canvas-left-bottom'));
    // draw(document.getElementById('canvas-right-bottom'));

    const top_offset = 992;

    let theToggleMenu = document.getElementById('toggle');
    theToggleMenu.onclick = function() {
        toggleClass(this, 'on');
        return false;
    }

    let photos = $(".change-photos");
    let photo2 = $(".change-photos .change-photo:nth-of-type(2)");
    let photo1 = $(".change-photos .change-photo:nth-of-type(1)");

    photos.on('click', function () {
        if(isMobileDevice()){
            displayPhoto(photo1, photo2);
        }
    });
    photos.hover(function(){
        if(!isMobileDevice()){
            displayPhoto(photo1, photo2);
        }
    });

    document.addEventListener('scroll', (e) => {
        scrollToTop();
        scrollLayers();
    });

    // Scroll to top button appear;
    let scroll_to_top_visible = false;
    function scrollToTop(){
        const scroll_to_top = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scroll_to_top_visible) {
                fadeIn(scroll_to_top);
                scroll_to_top.style.opacity = 1;
                scroll_to_top_visible = true;
            }
        } else {
            if (scroll_to_top_visible) {
                fadeOut(scroll_to_top);
                scroll_to_top_visible = false;
            }
        }
    }

    let mouse_y = null;
    let mouse_x = null;
    let cScroll = 0;

    function scrollLayers(){
        if (isMobileDevice())
            return;
        cScroll = $(this).scrollTop();
        moveLayers(top_offset, mouse_x, mouse_y, cScroll);     
    }

    document.addEventListener('mousemove', onMouseMove);
    function onMouseMove(e){
        if (isMobileDevice()) {
            mouse_x = 0;
            return;
        }
        mouse_y = e.clientY;
        mouse_x = e.clientX;
        moveLayers(top_offset, mouse_x, mouse_y, cScroll); 
    }

    
    $(window).on('resize', function(){
        setStartingPosition(); 
        expandSelectedService(selected_service_jq);
    });

    let selected_service = null;
    let selected_service_jq = null;
    let t_content = null;

    document.querySelectorAll('.service').forEach(service => {
        service.onclick= function() {
            t_content=$(this).attr("href");
            if($(window).width() > max_width){
                if(selected_service != this){
                    $(selected_service_jq).hide();
                    toggleClass(this, 'on');
                    removeClass(selected_service, 'on');
                    $(t_content).show();
                    selected_service = this;
                }
            }else{
                if($(selected_service_jq).css("max-height") != '0px'){
                    animatedCollapsible($(selected_service_jq));
                }
        
                if(selected_service != this){
                    animatedCollapsible($(t_content));
                    selected_service = this;
                }
                else
                    selected_service = null;
                
            }
            selected_service_jq = $(t_content);
            return false;
        }
    });


    function changeCollapsible(){
        if($(window).width() <= max_width){
            document.querySelectorAll('.service').forEach(service => {
              
                t_content=$(service).attr("href");
                $(service).append($(t_content));
                $(t_content).show();   
                $(t_content).addClass('tab_content');
                if(selected_service && selected_service != service && $(t_content).css("max-height") != '0px'){
                    animatedCollapsible($(t_content));
                }

            });
            if(selected_service){
                removeClass(selected_service, 'on');

                if($(selected_service_jq).css("max-height") == '0px')
                    animatedCollapsible($(selected_service_jq));
            }
        }
        else{
            document.querySelectorAll('.service').forEach(service => {
    
                t_content=$(service).attr("href");
                $(t_content).removeClass('tab_content');
                $('.tabs_content').append($(t_content));
                $(t_content).hide();

                if(service.id == 'first-service' && selected_service == null){
                    selected_service = service;
                    selected_service_jq = $(t_content);
                    
                }
                if(selected_service == service){
                    addClass(selected_service, 'on');
                    $(t_content).show();     
                }
            });
        }
    }


    let max_width;
    function setStartingPosition(){
        mouse_x = 0;
        mouse_y = 0;
    
        max_width = getChangeMaxWidth();
        moveLayers(top_offset);
        changeCollapsible();
        moveBlurr(top_offset);
        changeVisiblePhoto(photos, photo1, photo2);
    }

    setStartingPosition();
    loadVideo();

});




function getChangeMaxWidth(){
    if(isMobileDevice()){
        return 992;
    }
    return 975;
}


function displayPhoto(photo1, photo2){
    if(photo2.hasClass('active')){ 
        photo2.removeClass('active');
        photo1.addClass('active');
    }
     else{
        photo1.removeClass('active');
        photo2.addClass('active');
    }
}

function changeVisiblePhoto(photos, photo1, photo2){

    photo1.addClass('active');
    photo2.removeClass('active');
   
    photos.css("height", photo1.height() + "px");
    
    
}

function animatedCollapsible(content){
    
    if ($(content).css("max-height") != '0px'){
        $(content).css("max-height", '');
        
    } else {
        let scrollHeight = $(content).prop('scrollHeight');
        $(content).css("max-height", scrollHeight+"px");
    }
}

function expandSelectedService(service_content){
     if(service_content){
        if ($(service_content).css("max-height") != '0px'){
            let scrollHeight = $(service_content).prop('scrollHeight');
            $(service_content).css("max-height", scrollHeight+"px");
        }
     }   
}


function loadVideo(){
    let lazyVideos = [].slice.call(document.querySelectorAll("video.page-video"));

    if ("IntersectionObserver" in window) {
        var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(video) {
                if (video.isIntersecting) {
                    for (var source in video.target.children) {
                        var videoSource = video.target.children[source];
                        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                            videoSource.src = videoSource.dataset.src;
                        }
                    }
        
                    video.target.load();
                    lazyVideoObserver.unobserve(video.target);
                }
            });
        });
    
        lazyVideos.forEach(function(lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    }
}



function moveLayers(top_offset, mouse_x=null, mouse_y=null, cScroll=null){
    let num_layer = 0;
    let x, y;

    let perY = 1;
    if(mouse_x!=null)
        perY = 1.2;

    document.querySelectorAll('.canvas-container').forEach(cnt => {
        let layer = cnt.querySelector('.layer');
        if(layer == null) return;

        const speed = Number(layer.getAttribute('data-speed'));
        const offsetX = Number(layer.getAttribute('offset_x'));
        const offsetY = Number(cnt.getAttribute('offset_y'));
        const layerAngle = Number(layer.getAttribute('angle'));
        const layerY = Number(layer.getAttribute('offset_y'));

        if(mouse_x!=null){
            x = Math.sign(speed)*(window.innerWidth - mouse_x*speed)/100 + offsetX;
            y = (window.innerHeight - (mouse_y+cScroll)*speed)/100 + offsetY;  
        }
        else{
            x = offsetX + Math.sign(offsetX)*(50);
            y = offsetY;
        }

        if($(window).width() < top_offset){
            y += (top_offset - $(window).width());
            if(num_layer%2 != 0)
                x += (top_offset - $(window).width());
            if(num_layer == 2)
                $('.clearfix').css('top', 200 + y*perY + "px");
        }
    
        else{
            if(num_layer == 2)
                $('.clearfix').css('top', 200 +"px");
        }

        if(mouse_x!=null)
            moveLayer(cnt, layer, x, y, layerAngle, num_layer);
        else
            moveMobileLayer(cnt, layer, y, x, layerY, layerAngle, num_layer);
        
        num_layer += 1;
        
    });
}

function moveLayer(cnt, layer, x, y, layerAngle, num_layer){
    if(layer.id == 'canvas-right-bottom'){ 
        cnt.style.top = 90 + 'px';
        layer.style.transform = `translateX(${x}px) translateY(${y + 200}px) rotate(${180 + y + layerAngle}deg)`;
    }
    else{
        if(num_layer != 2)
            cnt.style.top = y + 'px';
        layer.style.transform = `translateX(${x}px) rotate(${180 + y + layerAngle}deg)`;
    }
    layer.style.transition = 'rotate 0.09s linear';
}

function moveMobileLayer(cnt, layer, cntY, layerX, layerY, layerAngle, num_layer){
    if(num_layer != 2)
        cnt.style.top = cntY + 'px';
    layer.style.transform = `translateX(${layerX}px) translateY(${layerY}px) rotate(${layerAngle}deg)`;
}


function moveBlurr(top_offset){
    if($(window).width() < top_offset){
        let win_width = top_offset - $(window).width();
        let width_blurr_top = 1000-win_width;
        $('.background-ellipse-top').css("width","calc(10% + " + width_blurr_top + "px)");
        $('.background-ellipse-bottom').css("top", win_width*0.8 + "px");
        $('.background-ellipse-middle').css("top", -300+win_width*0.8 + "px");
    }
    else{
        $('.background-ellipse-top').css("width","calc(10% + 1000px)");
        $('.background-ellipse-bottom').css("top", '0');
        $('.background-ellipse-middle').css("top", "-300px");
    }
}

function isMobileDevice(){

    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /BB/i,
        /PlayBook/i,
        /IEMobile/i, 
        /Windows Phone/i,
        /Kindle/i,
        /Silk/i,
        /Opera Mini/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};


// function draw(canvas){
//     let ctx = canvas.getContext('2d');
//     ctx.lineWidth = 4;
//     ctx.beginPath();
//     ctx.moveTo(204, 61);
//     ctx.lineTo(604, 61);
//     ctx.lineTo(804, 403);
//     ctx.lineTo(604, 749);
//     ctx.lineTo(204, 749);
//     ctx.lineTo(4,403);
//     ctx.strokeStyle = '#fff200';
//     ctx.closePath();
//     ctx.stroke();
//   }

// based on Todd Motto functions
// https://toddmotto.com/labs/reusable-js/


function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

function addClass(elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}

function removeClass(elem, className) {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

function toggleClass(elem, className) {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, " " ) + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0 ) {
            newClass = newClass.replace( " " + className + " " , " " );
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}