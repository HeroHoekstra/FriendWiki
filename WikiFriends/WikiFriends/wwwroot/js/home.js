$(document).ready(() => {
   const inputField = $('#search-box');
   $('#search-type').change((e) => {
      inputField.attr('placeholder', `Search for ${e.target.value}`);
   });
});