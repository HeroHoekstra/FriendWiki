$(document).ready(() => {
   const form = $('#search-form');
   const inputField = $('#search-box');
   
   $('#search-type').change((e) => {
      const val = e.target.value;
      
      inputField.attr('placeholder', `Search for ${val}`);
      
      if (val === "users")
         form.attr('action', '/user/search');
      if (val === "articles")
         form.attr('action', '/article/search');
   });
});