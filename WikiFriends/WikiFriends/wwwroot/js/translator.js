async function getJson() {
   let json;
   try {
      const lang = $('html').attr('lang');
      
      const response = await fetch(`/resources/translation/${lang}.json`);
      if (response.status === 404) {
         console.warn(`Could not find translation for language '${lang}', defaulting to English`);
         json = {};
      } else if (!response.ok) {
         throw new Error("Something went wrong");
      } else {
         json = await response.json();
      }
   } catch (error) {
      console.error(`Error: ${error}`);
      json = {};
   }
   return json;
}

$(document).ready(async () => {
   // Get all objects with "tr" as custom attribute
   const elements = $('*[data-tr]');
   
   // No reason to load the JSON, if there is no data
   if (elements.length <= 0)  return;
   
   const json = await getJson();
   if (jQuery.isEmptyObject(json)) return;
   
   elements.each((index, e) => {
      // Get element's tr data
      const $el = $(e);
      // Check if the translation item exists
      const txt = json[$el.data('tr')];
      console.log(json);
      
      if (!txt) {
         console.warn(`Translation item '${$el.data('tr')}' not found.`);
         return;
      }
      
      $el.text(txt);
   });
});