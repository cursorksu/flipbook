/**
 */
// Set the width and height for the viewport

function resizeViewport() {

    var width = $(window).width(),
        height = $(window).height() - 80,
        options = $('.flipbook').turn('options');
    $('.flipbook-viewport').css({
        width: width,
        height: height
    }).zoom('resize');


    var bound = calculateBound({
        width: options.width,
        height: options.height,
        boundWidth: Math.min(options.width, width) - 110,
        boundHeight: Math.min(options.height, height)
    });

    if (bound.width % 2 !== 0)
        bound.width -= 1;


    if (bound.width != $('.flipbook').width() || bound.height != $('.flipbook').height()) {

        $('.flipbook').turn('size', bound.width, bound.height);

        if ($('.flipbook').turn('page') == 1)
            $('.flipbook').turn('peel', 'br');
    }

    $('.flipbook').css({top: -bound.height / 2, left: -bound.width / 2});
}

// Calculate the width and height of a square within another square

function calculateBound(d) {

    var bound = {width: d.width, height: d.height};

    if (bound.width > d.boundWidth || bound.height > d.boundHeight) {

        var rel = bound.width / bound.height;

        if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {

            bound.width = Math.round(d.boundHeight * rel);
            bound.height = d.boundHeight;

        } else {

            bound.width = d.boundWidth;
            bound.height = Math.round(d.boundWidth / rel);

        }
    }

    return bound;
}

function addPage(page, book, imagePath, pageId, slideBlocks) {

    var id, pages = book.turn('pages');

    // Create a new element for this page
    var element = $('<div />', {});

    // Add the page to the flipbook
    if (book.turn('addPage', element, page)) {

        // Add the initial HTML
        // It will contain a loader indicator and a gradient
        element.html('<div class="loader"></div>');

        // Load the page
        loadPage(page, element, imagePath, pageId, slideBlocks);
    }

}

function loadPage(page, pageElement, imagePath, pageId, slideBlocks) {

    // Create an image element

    var img = $('<img />');

    img.mousedown(function(e) {
        e.preventDefault();
    });

    pageElement.attr('id', 'page-' + pageId);

    img.load(function() {

        // Set the size
        $(this).css({width: '100%', height: '100%'});

        // Add the image to the page after loaded

        $(this).appendTo(pageElement);
        //console.log('image ' + pageId + ' loaded!');

        if(slideBlocks != undefined){
            $.each(slideBlocks, function( index , value ){
                //console.log(value);
                var side = index + 1;
                var slideBlock = "<div class='page-extra__slide-block-control page-extra__slide-block-control_" + pageId + "_" + side + "' data-target='.page-extra__slide-block_" + pageId + "_" + side + "'></div><div class='page-extra__slide-block page-extra__slide-block_" + pageId + "_" + side + "'><img src='" + value + "' style='width: 100%; height: 100%;'></div>";
                pageElement.append(slideBlock);
            });
        }
        //var slideBlock = "<div class='page-extra__slide-block-control page-extra__slide-block-control_95_"+ side +"' data-target='.page-extra__slide-block_95_1'></div><div class='page-extra__slide-block page-extra__slide-block_95_1'><img src='assets/images/sanbook46_3box.jpg' style='width: 100%; height: 100%;'></div>";
        //pageElement.append(slideBlock);

        // Remove the loader indicator

        pageElement.find('.loader').remove();
    });

    // Load the page

    img.attr('src', imagePath);

}