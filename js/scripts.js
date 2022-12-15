window.addEventListener('DOMContentLoaded', event => {

    // draw(document.getElementById('canvas-left-top'));
    // draw(document.getElementById('canvas-right-top'));
    // draw(document.getElementById('canvas-left-bottom'));
    // draw(document.getElementById('canvas-right-bottom'));

    let scrollToTopVisible = false; 
    let mouse_y = 0;
    let mouse_x = 0;
    let cScroll = 0;

    let theToggle = document.getElementById('toggle');
    theToggle.onclick = function() {
        toggleClass(this, 'on');
        return false;
    }

    let photos = $(".change-photos");
    let photo2 = $(".change-photos .change-photo:nth-of-type(2)");
    let photo1 = $(".change-photos .change-photo:nth-of-type(1)");

    function changeVisiblePhoto(){
        photo2.css('display', 'none');
        photo1.css('display', 'block');
    }

    function displayPhoto(){
        if(photo2.css('display') == "none"){
            photo2.show();
            photo1.hide();
        }
         else{
            photo2.hide();
            photo1.show();
        }
    }

    photos.on('click', function () {
        if(isMobileDevice()){
            displayPhoto();
        }
    });

    photos.hover(function(){
        if(!isMobileDevice()){
            displayPhoto();
        }
    });

    // Scroll to top button appear
    document.addEventListener('scroll', (e) => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTop.style.opacity = 1;
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    });

    

    $(window).on('resize', function(){
        mouse_x = 0;
        mouse_y = 0;
        
        changeVisiblePhoto();
        playVideo();
    });
   

    $(window).on('scroll', function() {
           
        cScroll = $(this).scrollTop();
        document.querySelectorAll('.canvas-container').forEach(cnt => {
            let layer = cnt.querySelector('.layer');
            if(layer == null)
                return;
            const speed = Number(layer.getAttribute('data-speed'));
            const offsetX = Number(layer.getAttribute('offset_x'));
            const offsetY = Number(cnt.getAttribute('offset_y'));

            const x = Math.sign(speed)*(window.innerWidth - mouse_x*speed)/100 + offsetX;
            const y = (window.innerHeight - (mouse_y+cScroll)*speed)/100 + offsetY;  

            moveLayers(cnt, layer, x, y);
            
        })
    });
   


    document.addEventListener('mousemove', onMouseMove);
    function onMouseMove(e){
        if (isMobileDevice()) {
            mouse_x = 0;
            return;
        }else{
            document.querySelectorAll('.canvas-container').forEach(cnt => {
                let layer = cnt.querySelector('.layer');
                if (layer == null)
                    return;
                const speed = Number(layer.getAttribute('data-speed'));
                const offsetX = Number(layer.getAttribute('offset_x'));
                const offsetY = Number(cnt.getAttribute('offset_y'));

                const x = Math.sign(speed)*(window.innerWidth - e.clientX*speed)/100 + offsetX;
                const y = (window.innerHeight - (e.clientY+cScroll)*speed)/100 + offsetY;
            
                mouse_y = e.clientY;
                mouse_x = e.clientX;
                
                moveLayers(cnt, layer, x, y);
                    
            })
        }
    }

    playVideo();
    
});

function playVideo(){
    if(!isMobileDevice()){
        loadVideo();
    }
    else{
        removeVideo();
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
                        if (!isMobileDevice() && typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
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

function removeVideo(){
    let lazyVideos = document.querySelectorAll(".page-video");
    lazyVideos.forEach(lazyVideo => {
        for (var source in lazyVideo.children) {
            var videoSource = lazyVideo.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                videoSource.src = '';
            }
        }
        lazyVideo.load();
    });
    
}



function moveLayers(container, layer, x, y){
    if(layer.id == 'canvas-right-bottom'){ 
        container.style.top = 150 + 'px';
        layer.style.transform = `translateX(${x}px) translateY(${y+520}px) rotate(${180+y}deg)`;
    }
    else{
        container.style.top = y + 'px';
        layer.style.transform = `translateX(${x}px) rotate(${180+y}deg)`;
    }
    layer.style.transition = 'rotate 0.09s linear';
}


function getMaxHeight(){
    var body = document.body,
    html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight, 
                   html.clientHeight, html.scrollHeight, html.offsetHeight );
    return height;
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
    }); //|| (( window.innerWidth <= 800 ));
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

// hasClass
function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}
// addClass
function addClass(elem, className) {
    if (!hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
}
// removeClass
function removeClass(elem, className) {
    var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

// toggleClass
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