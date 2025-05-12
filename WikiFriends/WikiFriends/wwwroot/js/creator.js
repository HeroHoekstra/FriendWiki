// TODO: fix article nav

$(document).ready(() => {
    // Title
    $('#page-title').on('input', function() {
        if ($(this).text() === '') {
            $('title').text('Creator - FriendWiki');
        } else {
            $('title').text(`${$(this).text()} - FriendWiki`);   
        }
    });
    
    $('.p-add-button.first-add').on('click', function(e) {
        e.preventDefault();
        addParagraph($(this), true);
        setLocations();
    });
});

function addParagraph(caller, first = false) {
    const html = $('#template-paragraph').html();
    const element = $(html);
    
    if (!first) {
        const previous = $(caller).parent();
        element.insertAfter(previous);
    } else {
        const container = $('.paragraphs');
        container.prepend(element);
    }

    const title = $('.p-title', element);
    $(element).on('click', '.p-add-button', function(e) {
        e.preventDefault();
        addParagraph($(this));
        setLocations();
    });
    
    $(element).on('click', '.p-del-button', function(e) {
        e.preventDefault();
        if (confirm(`Are you sure you want to delete ${title.text()}?`)) {
            element.remove();
        }
    });
}

function setLocations() {
    const paragraphs = $('.paragraph');
    paragraphs.each(function(i, e) {
       $(e).attr('data-location', `${i}`);
    });
}
