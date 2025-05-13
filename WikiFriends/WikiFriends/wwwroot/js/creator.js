// TODO: fix article nav

let data = {
    title: "Title",
    lead: "Lead",
    paragraph: {}
}

$(document).ready(() => {
    // Title
    $('#page-title').on('input', function() {
        if ($(this).text() === '') {
            $('title').text('Creator - FriendWiki');
        } else {
            $('title').text(`${$(this).text()} - FriendWiki`);   
        }
        data.title = $(this).text();
    });
    
    $('#page-lead').on('input', function() {
        data.lead = $(this).text(); 
    });
    
    $('.p-add-button.first-add').on('click', function(e) {
        e.preventDefault();
        addParagraph($(this), true);
        setLocations();
    });
    
    $('.submit').on('click', function(e) {
        e.preventDefault();
        submit();
    })
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

    // Collect article data
    const title = $('.p-title', element);
    const body = $('.p-body', element);
    const location = $(element).data('location');

    if (!data.paragraph[location]) {
        data.paragraph[location] = {
            p_title: "Paragraph Title",
            p_body: "Paragraph Body"
        };
    }
    
    title.on('input', function() {
        data.paragraph[location].p_title = $(this).text();
        console.log(data);
    });
    body.on('input', function() {
        data.paragraph[location].p_body = $(this).text();
    });
    
    // Adding and removing paragraphs
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

function submit() {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('lead', data.lead);
    
    Object.keys(data.paragraph).forEach((key, i) => {
        formData.append("p_title", data.paragraph[key].p_title);
        formData.append("p_body", data.paragraph[key].p_body);
    });
    
    fetch("/article/creator/create", {
        method: 'POST',
        body: formData,
    }).then(res => res.text())
      .then((res) => {
          const json = JSON.parse(res);
          if (json.success && json.articleId) {
              window.location.href = `/article/${json.articleId}`;
          } else {
              console.error("这不起作用！"); // "这不起作用！" means "This did not work!" btw.
          }
      })
      .catch(err => console.log(err));
}
