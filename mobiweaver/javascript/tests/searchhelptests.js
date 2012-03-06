// Mobiweaver search help widget unit tests

$(document).ready(function(){

      module("mobiweaver.searchhelp", {
          setup: function() {
              $("#testPage").page();
          },
          teardown: function() {
          }
      });

      test("first test within module", function() {
        expect(2);
        var sh = $("#tcode").jqmData('searchhelp');
        ok(sh, "Search Help exists and is attached to the input element");
        equal(sh.options.searchHelp, "CU01G", "Search Help name is correct");
      });

      // FIXME both these asyncTests sometimes pass, sometimes fails with a strange qUnit error
      asyncTest("Search help XML handling", function() {
          expect(6);
          var shWidget = $("#tcode").jqmData('searchhelp');
          $.get("fields.xml",
             function(data){
               shWidget.configureSearchHelp($(data), "KNART");
               equal(shWidget.searchHelpList.length, 1, "Read 1 search help from the XML document");
               var sh = shWidget.searchHelpList[0];
               equal(sh.name, "CU01G");
               equal(sh.fields.length, 5);
               equal(sh.fields[0].name, "KNGRP");
               equal(sh.fields[0].description, " Dep. Group ");
               equal(sh.fields[0].datatype, "text");
               start();
             }, "xml");
      });

      asyncTest("In the search help list, if the SH does not have the output field it is filtered out", function() {
          expect(2);
          var shWidget = $("#tcode").jqmData('searchhelp');
          $.get("fields_collective.xml",
             function(data){
               shWidget.configureSearchHelp($(data), "COUNTRY");
               equal(shWidget.searchHelpList.length, 1, "Only 1 of the Search Helps has COUNTRY");
               shWidget.configureSearchHelp($(data), "CITY1");
               equal(shWidget.searchHelpList.length, 2, "Both search helps have CITY1");
               start();
             }, "xml");
      });


      asyncTest("Functional test", function() {
        // FIXME back() or close() generates a JS error
        expect(1);
        var shWidget = $("#tcode").jqmData('searchhelp');
        shWidget.fieldsController = 'fields.xml';
        shWidget.inputElement.trigger('searchhelp', {'method': 'open'});
        setTimeout(function() {
            ok($.mobile.activePage.find("input[name='KNGRP']").length==1, "Field is rendered");
//                       window.history.back();
//                       shWidget.inputElement.trigger('searchhelp', {'method': 'close'});
            start();
        }, 100);
      });
});