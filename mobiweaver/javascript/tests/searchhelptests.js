// Mobiweaver search help widget unit tests

$(document).ready(function(){
    
    var utils = {
      xmlfield: function(name) {
        return '<field name='+name+'>';
      }
    };

      module("mobiweaver.searchhelp", {
          setup: function() {
              $("#testPage").page();
          },
          teardown: function() {
          }
      });

      test("First test within module", function() {
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
      
      asyncTest("Visible result list fields", function() {
        expect(9);
        var shWidget = $("#tcode").jqmData('searchhelp');
        $.get("fields_collective.xml",
           function(data){
             shWidget.configureSearchHelp($(data), "COUNTRY");
             // tests with list based result fields 
             shWidget.options.resultTableFields = ["COUNTRY","MC_NAME1"];
             ok(shWidget._isFieldVisible(utils.xmlfield("MC_NAME1"),"ADMCL"), "Field is visible in the list output");
             equal(shWidget._isFieldVisible(utils.xmlfield("ADDR_GROUP"),"ADMCL"), false, "Field is not visible in the list output");
             // tests with multiple list results fields
             shWidget.options.resultTableFields = {"ADMCL":["COUNTRY","MC_NAME1"], "ADMCN":["MC_NAME1","CITY1"]};
             ok(shWidget._isFieldVisible(utils.xmlfield("MC_NAME1"),"ADMCL"), "Field is visible in the list output");
             ok(shWidget._isFieldVisible(utils.xmlfield("CITY1"),"ADMCN"), "Field is visible in the list output");
             equal(shWidget._isFieldVisible(utils.xmlfield("COUNTRY"),"ADMCN"), false, "Field is not visible in the list output");
             equal(shWidget._isFieldVisible(utils.xmlfield("POST_CODE1"),"ADMCN"), false, "Field is not visible in the list output");
             // tests with no list result fields setup
             shWidget.options.resultTableFields = undefined;
             ok(shWidget._isFieldVisible(utils.xmlfield("MC_NAME1"),"ADMCL"), "Field is visible in the list output");
             ok(shWidget._isFieldVisible(utils.xmlfield("ADDR_GROUP"),"ADMCL"), "Field is visible in the list output");
             ok(shWidget._isFieldVisible(utils.xmlfield("CITY1"),"ADMCN"), "Field is visible in the list output");
             start();
           }, "xml");
      });
      
});