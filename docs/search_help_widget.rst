==================
Search help widget
==================

The following files must be included:

- the jQueryMobile javascript
- the jQueryMobile CSS
- the search help javascript
- the search help CSS

The search help javascript and CSS files are included in this distribution. Also included is a patched version
of jQueryMobile 1.0 to support the SAP URL scheme. 

These files can be installed in the Netweaver server (for example as BSP MIME objects),
or served from a dedicated web server for better performance. 
For easier testing the files can also be included from online servers: the jQuery is available on code.jquery.com and the mobiweaver files can be linked from cogni.bitbucket.org/mobiweaver. 
Below an example (also used in the sample applications header file)::

  <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" />
  <link rel="stylesheet" href="http://cogni.bitbucket.org/mobiweaver/jquery.mobiweaver.searchhelp-0.1.css" />
  <script src="http://code.jquery.com/jquery-1.6.4.js"></script>
  <script src="http://cogni.bitbucket.org/mobiweaver/jquery.mobile-1.0.mobiweaver.js"></script>
  <script src="http://cogni.bitbucket.org/mobiweaver/jquery.mobiweaver.searchhelp-0.1.js"></script>

In order to set the search help widget in a form element, the following setup is needed:

- add the data-role="searchhelp" in the form element
- set a data-options element with keys:

    - *searchHelp*  - a search help in the SAP server 
    - *type* (optional) - set to "C" in case of a collective search help. Can be omitted otherwise.
    - *resultField* - the field name that will transfer the value to the html form field
    - *resultTableFields* (optional) - this field has information for restricting the results display to a subset of fields in the search help; it can be either a list of fields to display, and in this case it applies to all search helps inside a collective search help, or it can be an object with keys the search help names and values the corresponding lists of fields to display; defaults to showing all the columns.
    - *baseUrl* (optional): the url where the search.do and fields.do scripts reside. defaults to "/sap/bc/bsp/sap/ymwsearchhelp/"
    - *transition* (optional): jQueryMobile transition used when opening/closing the dialogs (defaults to "pop").
    - *searchHelpTheme* (optional): the jQueryMobile theme for the Search Help dialog (defaults to "a").
    - *overlayTheme* (optional): set this to a jQueryMobile theme if you want to use a different theme for the overlay.
    - *dialogTitle* (optional):  the title of the Search Help dialog window. defaults to "Search Help"
    - *noResultsMsg* (optional): message to show when the search doesn't return any results. defaults to "No results found", 

Example::

  <input type="text" name="tknum" data-role="searchhelp" 
       data-options='{"searchHelp": "sh_tknum", "resultField": "tknum", "resultTableFields":["tknum", "shtyp","tplst"] }'>

Example of a collective search help::

  <input type="text" name="carriers" data-role="searchhelp" 
     data-options='{"searchHelp": "F4_CARRIERS", "type": "C", "resultField": "LIFNR", "resultTableFields": {"KREDA":["LIFNR","PSTLZ"], "F4_LFA1_ACCT":["LIFNR","NAME1","LAND1"]} }'>



Minified 
--------

To reduce the size of both Javascript files and reduce their loading time, you can create minified versions.
The included Makefile performs this task using yuicompressor.

The minified files are also available from::

    http://cogni.bitbucket.org/mobiweaver/jquery.mobile-1.0.mobiweaver.min.js
    http://cogni.bitbucket.org/mobiweaver/jquery.mobiweaver.searchhelp-0.1.min.js
