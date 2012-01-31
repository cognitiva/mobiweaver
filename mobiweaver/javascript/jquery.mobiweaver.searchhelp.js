/*
 * Search Help - Search Help widget for jQuery Mobile.
 *
 *
 * Sources:
 * JQuerymobile.datebox
 * http://www.hiddentao.com/archives/2011/11/07/how-to-write-a-custom-widget-for-jquery-mobile/
 * http://wiki.jqueryui.com/w/page/12138135/Widget%20factory
 *
 */
(function($, undefined) {
    $.widget("mobiweaver.searchhelp", $.mobile.widget , {
        closed: false,
        /** Available options for the widget are specified here, along with default values. */
        options: {
            resultField: "NAME", // name of the field which holds the value to copy to the text box; should be in UPPER case; to be safe we force it to be on _create.
            resultTableFields: undefined, // if you want to filter out some columns in the search results table, set this to a list of visible fields.
            baseUrl: "/sap/bc/bsp/sap/ymwsearchhelp/", // the url where the search.do and fields.do scripts reside.
            transition: "pop", // jQueryMobile transition used when opening/closing the dialogs.
            searchHelpTheme: 'a', // the jQueryMobile theme for the Search Help dialog.
            overlayTheme: false, // set this to a jQueryMobile theme if you want to use a different theme for the overlay.
            dialogTitle:  "Search Help", // the title of the Search Help dialog.
            noResultsMsg: "No results found", // message to show when the search doesn't find any results.
            disabled: false
        },

        _searchhelpHandler: function(event, payload) {
            // Handle all event triggers that have an internal effect
            if (!event.isPropagationStopped()) {
                switch (payload.method) {
                    case 'open':
                        $(this).jqmData('searchhelp').open();
                        break;
                    case 'close':
                        $(this).jqmData('searchhelp').close(payload.fromCloseButton, payload.fromListPage);
                        break;
                    case 'set':
                        $(this).val(payload.value);
                        $(this).trigger('change');
                        break;
                    case 'search':
                        $(this).jqmData('searchhelp').search(payload.value);
                        break;
                    default:
                        break;
                }
            }
        },

        /** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
        _create: function() {
            $(document).trigger("searchhelpcreate");
            var self = this;
            var inputElement = this.element;
            // control when the search help form is initialized
            var formInit = false;
            var opts = $.extend(this.options, inputElement.jqmData("options"));
            // get the current page's theme (or the searchHelpTheme if we can't find it)
            var thisTheme = $.mobile.getInheritedTheme(inputElement, opts.searchHelpTheme);
            opts.overlayTheme = opts.overlayTheme || thisTheme;
            opts.resultField = opts.resultField.toUpperCase(); // in SAP the field name is always in UPPER CASE.
            if ($.isArray(opts.resultTableFields)) {
                for (var i=0; i<opts.resultTableFields.length; i++) {
                    // field names are always in uppercase in SAP
                    opts.resultTableFields[i] = opts.resultTableFields[i].toUpperCase();
                }
            } else {
                opts.resultTableFields = undefined;
            }
            var thisPage = inputElement.closest('.ui-page');
            var focusedEl = inputElement.wrap('<div class="ui-input-searchhelp ui-shadow-inset ui-corner-all ui-body-'+ thisTheme +'"></div>').parent();
            var helpBtn = $('<a href="#" class="ui-input-clear ui-searchhelp" title="search help">search help</a>').bind('vclick', function (e) {
                e.preventDefault();
                if (!opts.disabled) { 
                        self.inputElement.trigger('searchhelp', {'method': 'open'});
                }
                setTimeout(function() {
                    $(e.target).closest("a").removeClass($.mobile.activeBtnClass);
                }, 300);
            }).buttonMarkup({icon: 'searchhelp', iconpos: 'notext', corners:true, shadow:true})
              .css({'vertical-align': 'middle', 'float': 'right'});
            // the formPage is kept unitialized and the page() method will be called in the first open call
            inputElement.after(helpBtn);
            inputElement.bind('searchhelp', this._searchhelpHandler);
            inputElement.removeClass('ui-corner-all ui-shadow-inset').focus(function(){
                if (!opts.disabled) {
                    focusedEl.addClass('ui-focus');
                }
                inputElement.removeClass('ui-focus');
            }).blur(function(){
                    focusedEl.removeClass('ui-focus');
                    inputElement.removeClass('ui-focus');
                }
            );
            var formPage = $("<div data-role='dialog' class='ui-dialog' data-theme='" + opts.searchHelpTheme + "' data-overlay-theme='" + opts.overlayTheme + "'>" + 
                                "<div data-role='header' data-backbtn='false' data-theme='" + opts.searchHelpTheme + "'>" +
                                    "<div class='ui-title'>" + opts.dialogTitle + "</div>" +
                                "</div>" +
                            "<div data-role='content'></div>" +
                            "</div>")
                                .appendTo( $.mobile.pageContainer );
            var listPage = $("<div data-role='dialog' class='ui-dialog' data-theme='" + opts.searchHelpTheme + "' data-overlay-theme='" + opts.overlayTheme + "'>" +
                                "<div data-role='header' data-backbtn='false' data-theme='" + opts.searchHelpTheme + "'>" +
                                    "<div class='ui-title'>" + opts.dialogTitle + "</div>" +
                                "</div>" + 
                                "<div data-role='content'></div>" +
                            "</div>")
                                .appendTo( $.mobile.pageContainer ).page();
            listPage.find( ".ui-header a").unbind('vclick').bind('vclick', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                self.inputElement.trigger('searchhelp', {method:'close', fromCloseButton:true, fromListPage: true});
            });
            $.extend(this, {
                thisPage: thisPage,
                formInit: formInit,
                inputElement: inputElement,
                listPage: listPage,
                focusedEl: focusedEl,
                formPage: formPage
            });
        },

        _buildUrl: function(page) {
            return this.options.baseUrl + page;
        },

        // call the server to get the search help metadata and build the search help form
        // execute the callback after the form initialization
        _initForm: function() {
            var self = this,
                searchhelpname = this.options.searchHelp;
            $.mobile.showPageLoadingMsg();
            $.ajax({
                url: this._buildUrl('fields.do'),
                data: { sh: searchhelpname },
                context: this.formPage.children(":jqmData(role='content')").first(),
                dataType: "xml",
                success: function(data) {
                    var page = '',
                        frm = '',
                        xmldoc = $(data);

                    page += '<form data-role="searchhelpform">';
                    page += '<input type="hidden" name="sh" value="' + searchhelpname + '">';
                    xmldoc.find('field').each(function(index) {
                        var description = $(this).text(),
                            name = $(this).attr('name'),
                            datatype = $(this).attr('datatype');
                        //FIXME logic for different data types
                        frm += '<label for="' + name + '">' + description + '</label>';
                        frm += '<input type="text" name="' + name + '">';
                    });
                    if (frm !== '') {
                        page += frm + '</form>';
                        page += '<a href="#searchhelp" id="help-result-button" data-role="button" data-inline="false">Search</a>';
                        $(this).html(page);
                        self.formPage.page();
                        self.formPage.find(".ui-header a").unbind('vclick').bind('vclick', function(e) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            self.inputElement.trigger('searchhelp', {'method':'close', 'fromCloseButton':true});
                        });
                        $(this).children(':jqmData(role="searchhelpform")').submit(function(e) {
                            e.preventDefault();
                            var shFormData = $(this).serialize();
                            self.inputElement.trigger('searchhelp', {'method':'search', 'value': shFormData});
                            return false;
                        });
                        $(this).find("a").each(function() {
                            $(this).bind('vclick', function(e) {
                                $(this).parent().children(':jqmData(role="searchhelpform")').submit();
                                return false;
                            });
                        });
                        self.formInit = true;
                        $.mobile.hidePageLoadingMsg();
                        $.mobile.changePage(self.formPage, {'transition': self.transition});
                    } else {
                        // no fields in response
                        $.mobile.hidePageLoadingMsg();
                    }
                },
                error: function() {
                      $.mobile.hidePageLoadingMsg();
                }
            });
        },

        open: function() {
            // prevent the parent page from being removed from the DOM,
            var self = this;
            this.thisPage.unbind("pagehide.remove");
            self.closed = false;
            if (this.formInit) {
                $.mobile.changePage(self.formPage, {'transition': self.options.transition});
            } else { 
                this._initForm();
            }
        },

        _isFieldVisible: function(field) {
            var fieldName = $(field).attr('name');
            return (this.options.resultTableFields==undefined ||
                ($.inArray(fieldName, this.options.resultTableFields)>-1));
        },

        search: function(value) {
            // TODO prevent the form page from being removed from the DOM?
            // this.thisPage.unbind( "pagehide.remove" );
            var self=this,
                searchResultsEl = this.listPage.children(":jqmData(role='content')").first();
            searchResultsEl.empty();
            $.mobile.showPageLoadingMsg();
            $.ajax({
                url: this._buildUrl('search.do'),
                data: value,
                dataType: "xml",
                context: searchResultsEl,
                error: function() {
                    $.mobile.hidePageLoadingMsg();
                    self._showErrorMessage();
                },
                success: function(data){
                    var xmldoc;
                    var resultTable = $('<table class="ui-mobiweaver-searchhelp"></table>');
                    var resultsExist = false;
                    xmldoc = $(data);
                    // header row
                    xmldoc.find('searchhelp entry').each( function(index) {
                        if (index === 0) {
                            resultsExist = true;
                            var header = $('<thead></thead>');
                            var headerRow = $('<tr></tr>');
                            $(this).children().each( function() {
                                if (self._isFieldVisible(this)) {
                                    var th = $('<th></th>').text($(this).attr('title'));
                                    headerRow.append(th);
                                }
                            });
                            header.append(headerRow);
                            resultTable.append(header);
                        }
                    });
                    if (resultsExist) {
                        // data
                        var tblBody = $('<tbody></tbody>');
                        xmldoc.find('searchhelp entry').each( function(index) {
                            var resultText = $(this).find("field[name='"+self.options.resultField+"']").text();
                            // TODO exception if not found
                            var resRow = $('<tr></tr>',  {'class': 'ui-btn ui-btn-up-' + self.options.searchHelpTheme, 'data-result': resultText, 'data-theme': self.options.searchHelpTheme});
                            $(this).children().each( function() {
                                if (self._isFieldVisible(this)) {
                                    var resData = $('<td></td>').text($(this).text());
                                    resRow.append(resData);
                                }
                            });
                            tblBody.append(resRow);
                        });
                        resultTable.append(tblBody);
                        $(this).append(resultTable);
                    } else {
                          $(this).append("<p>" + self.options.noResultsMsg + "</p>");
                    }
                    $.mobile.hidePageLoadingMsg();
                    $.mobile.changePage(self.listPage, {'transition': self.options.transition});
                    $(this).find("td").each(function() {
                        $(this).bind('vclick', function(e) {
                            e.preventDefault();
                            self.inputElement.trigger('searchhelp', {'method':'set', 'value': $(this).parent().attr('data-result')});
                            self.inputElement.trigger('searchhelp', {'method':'close'});
                        });
                    });
                }
            });
        },
        
        _showErrorMessage: function() {
            //show error message
            $( "<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>"+ $.mobile.pageLoadErrorMessage +"</h1></div>" )
                .css({ "display": "block", "opacity": 0.96, "top": $( window ).scrollTop() + 100 })
                .appendTo( $.mobile.pageContainer )
                .delay( 800 )
                .fadeOut( 400, function() {
                    $( this ).remove();
                });
        },

        close: function(fromCloseButton, fromListPage) {
            // Close the controls
            var self = this,
                callback;

            if (!fromCloseButton || fromListPage) {
                // user closed the results page
                if (!self.closed) {
                    window.history.go(-2);
                }
            }
            else {
                // user closed the form
                if (!self.closed) {
                    window.history.go(-1);
                }
            }
            if( !self.thisPage.data("page").options.domCache ){
                self.thisPage.bind( "pagehide.remove", function() {
                    $(self).remove();
                });
            }
            self.focusedEl.removeClass('ui-focus');
            self.closed = true;
        },

        // Use the destroy method to clean up any modifications your widget has made to the DOM
        destroy: function() {
            // remove button?
            this.inputElement.unbind('searchhelp');
            $.Widget.prototype.destroy.call( this );
        }
    } );
    /* Handler which initialises all widget instances during page creation. */
    $(document).bind("pagecreate", function(e) {
       $(document).trigger("searchhelpbeforecreate");
       return $(":jqmData(role='searchhelp')", e.target).searchhelp();
    });
})( jQuery );
