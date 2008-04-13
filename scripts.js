// INTELLECTUAL PROPERTY NOTICE
//
// Written by Jim Lehmer, jim (dot) lehmer (at) gmail (dot) com.
// Feel free to use and improve. I would love to hear about
// improvements and fixes, and maintaining attribution to me
// would be nice.
//
// Copyright (c) 2007 Jim Lehmer
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// DOCUMENTATION
//
// The purpose of these scripts is to allow for the debugging of HTML and CSS
// content using nothing more than the onmouseover event. It can be invoked in
// one of two ways:
//
// 1) Non-instrusive (preferred) - add the following code as a bookmarklet to your
// favorites/bookmarks:
//
// javascript:(function(){var d=document;var h=(d.getElementsByTagName(%27head%27))[0]?d.getElementsByTagName(%27head%27)[0]:d.body.appendChild(d.createElement(%27head%27));var s=d.createElement(%27script%27);s.setAttribute(%27src%27,%27http://dullroar.com/scripts/scripts.js%27);h.appendChild(s);window.setTimeout(function(){top.PageLoad();}, 300);})();
//
// Use this one for Safari:
//
// javascript:(function(){d=document;h=(d.getElementsByTagName('head'))[0]?d.getElementsByTagName('head')[0]:d.body.appendChild(d.createElement('head'));s=d.createElement('script');s.setAttribute('src','http://dullroar.com/scripts/scripts.js');h.appendChild(s);window.setTimeout(function(){top.PageLoad();},300);})();
//
// As written above, these bookmarklets pull this script off my personal
// domain. Feel free to copy the script to your own domain and change the
// bookmarklet accordingly.
//
// 2) Intrusive (deprecated) - place the following <script> element in the <head> section of
// the page to be debugged:
//
// <head>
//    ...
//    <script defer="defer" type="text/javascript" language="javascript" src="scripts.js"></script>
//    ...
// </head>
//
// Both will cause another window to open at onload containing debug information for
// the page that embeds this script. Then you can line the two pages up side by side
// or with the debug page behind the main window but still visible and then as you
// mouse over places in the main window, the debug window will show you element tags,
// ids, titles, names, alt text, the element hierarchy, the class hierarchy (if any)
// and all the styles being applied to the element. There are tools and add-ins that
// do this, but this allows the information to be seen without installing anything
// on the browser.
//
// This script has been tested using IE 6 & 7, Firefox 2 (Windows and Linux), Opera 9
// (Windows) and Safari 3 (beta - Windows). It does NOT work on Konqueror, at least
// not when launched by bookmarklet (since Konqueror doesn't support the javascript:
// URL binding, at least not that I know of).
//
// ACKNOWLEDGEMENTS
//
// Jason Diamond of Developmentor has been extremely helpful with feedback and
// suggestions for this script.
//
// ASSUMPTIONS 
//
// 1) Javascript is enabled for the browser.
//
// 2) For Opera, turn off popup blocking for the site you are testing against,
// And set preferences to "Open windows instead of tabs". For Safari, turn off
// popup blocking.
//
// 3) Any other popup blockers are set to allow popups from the site being
// tested.
//
// TO-DO'S
//
// 1) Right now this script overwrites the onmouseover event. If the page already
// has an onmouseover event handler, this will break that. It would be fairly easy
// (assuming there are no cross-browser issues) to add the code to save the previous
// onmouseover and add this code to it (have to decide whether to fire the original
// event first or second). Would also have to restore the original onunload.
//
// 2) Regex validation of the CSS styles that can be changed via text box (vs. those
// with fixed value lists that are presented as drop down lists).
//
// 3) Better positioning of the newly opened debugger page.
//
// 4) Better layout of the debug page, perhaps making into a tabbed page.
//
// 5) Bug fixes - see below.
//
// BUGS
//
// All bugs are currently of the cross-browser variety.
//
// 1) There is code to close the debug window when the main window closes. This works
// on IE but not Opera or Firefox.
//
// 2) When using in Firefox there seems to be a problem where the event handler
// freezes or uninstalls or otherwise stops working if you cursor across a fieldset
// element. Works fine in Opera and IE.
//
// 3) When using in Firefox there seems to be a problem where the event handler
// freezes or uninstalls or otherwise stops working if you Alt-Tab out of the main
// window or otherwise cause it to lose focus. Works fine on Opera and IE.
//
// 4) When using in Firefox there is a problem where the event handler throws an
// exception when hovering over a text input field. The exception is:
// "Permission denied to get property HTMLDivElement.tagname". Works fine on Opera
// and IE.

var oDebugWindow; // Extra window that is opened to display debug info

window.onload = PageLoad;

// Launch debug page and wire up event handlers.
function PageLoad()
{
    try
    {
        oDebugWindow = window.open("", "", "menubar=yes,resizable=yes,scrollbars=yes,status=yes,titlebar=yes,toolbar=yes");
        oDebugWindow.document.open();
        oDebugWindow.document.write(
            "<html>" +
            "<head>" +
                "<title>Debug CSS and XHTML</title>" +
                "<script type='text/javascript' language='javascript'>" +
                "function overrideStyle(id)" +
                "{" +
                    "var element = document.getElementById(id);" +
                    "if (element && document.currentDebugElement)" +
                    "{" +
                        "document.currentDebugElement.style[element.id] = element.value;" +
                    "}" +
                    "return true;" +
                "}" +
                "</script>" +
            "</head>" +
            "<body onload='try {document.currentDebugElement = null;} catch (ex) {}' " + 
                "onunload='try {if (window.opener && window.opener.document && window.opener.document.body) window.opener.document.body.onmouseover = null;} catch (ex) {}'>" +
                "<h1>Debugging Info</h1>" +
                "<h2>Element Info</h2>" +
                "<tt id='idDebugElem'>" +
                    "<strong>Tag:</strong>&nbsp;&nbsp;&nbsp;<span id='idTagName'></span><br />" +
                    "<strong>Id:</strong>&nbsp;&nbsp;&nbsp;&nbsp;<span id='idElemId'></span><br />" +
                    "<strong>Name:</strong>&nbsp;&nbsp;<span id='idElemName'></span><br />" +
                    "<strong>Title:</strong>&nbsp;<span id='idElemTitle'></span><br />" +
                    "<strong>Alt:</strong>&nbsp;&nbsp;&nbsp;<span id='idElemAlt'></span><br /><br />" +
                    "<strong>Element Tree:</strong>&nbsp;&nbsp;<span id='idElemTree'></span><br />" +
                    "<strong>Attributes:</strong>&nbsp;&nbsp;<span id='idAttributes'></span><br />" +
                "</tt>" +
                "<h2>Element Styles</h2>" +
                "<tt id='idDebugStyles'>" +
                    "<strong>Class Tree:</strong>&nbsp;<span id='idClassTree'></span><br /><br />" +
                    "<strong>Style:</strong><br /><p>You should be able to override any style below and have it propagate back to the parent page (except in Opera).</p><br />" +
                    "<br /><p>Style property names in <b style='color: red;'>red</b> were set explicitly in the cascade by stylesheets, style attributes or the browser. Otherwise it is a default value, or does not apply to a given element or browser.</p><br />" +
                    "*:hover {" +
                "</tt>" +
            "<pre><span id='idStyles'></span></pre>" +
                "<tt>}<br /></tt>" +
            "</body>" +
            "</html>"
        );
        oDebugWindow.document.close();
        document.body.onmouseover = DebugElems;
        document.body.onunload = PageUnload;
    }
    catch (ex)
    {
        alert("Exception occurred in PageLoad() - popup settings?\n\n" + ex);
    }
}

// Cleanup.
function PageUnload()
{
    document.body.onmouseover = null;

    if (oDebugWindow)
    {
        try
        {
            // For some reason this only seems to be working in IE. Security settings?
            oDebugWindow.close();
        }
        catch (ex)
        {
            // Silently toss the exception.
        }
    }
    
    oDebugWindow = null;
}

// Cross-browser run-time style-retriever. Modified from original version by Jason Diamond.
function getStyle(element, stylePropertyName)
{
    if (window.getComputedStyle)
    {
        return document.defaultView.getComputedStyle(element, null).getPropertyValue(stylePropertyName);
    }
    else if (element.currentStyle)
    {
        var sStylePieces = stylePropertyName.split("-");
        var sStyleName = sStylePieces[0];
        
        if (sStylePieces.length > 1)
        {
            for (var i = 1; i < sStylePieces.length; i++)
            {
                sStyleName += sStylePieces[i].charAt(0).toUpperCase() + sStylePieces[i].substring(1);
            }
        }
    
        return element.currentStyle[sStyleName];
    }
    else
    {
        return "";
    }
}

// Dump everything we know about the element currently being hovered over.
function DebugElems(event)
{
    var oAttributes;
    var sAttributes = "";
    var bMissing = false;
    var oElementTree;
    var oSrcElement;
    var sClassTree;
    var sElemTree;
    var sStyle = "";
    var sStyles = "";
    var oStyle;
    var oStyles =
    [
        {"property": "accelerator", "missing": "false", "values": "false|true"},
        {"property": "background", "missing": "inherit"},
        {"property": "background-attachment", "missing": "inherit", "values": "fixed|inherit|scroll"},
        {"property": "background-color", "missing": "inherit"},
        {"property": "background-image", "missing": "none"},
        {"property": "background-position", "missing": "inherit"},
        {"property": "background-position-x", "missing": "inherit"},
        {"property": "background-position-y", "missing": "inherit"},
        {"property": "background-repeat", "missing": "inherit", "values": "inherit|no-repeat|repeat|repeat-x|repeat-y"},
        {"property": "border", "missing": "inherit"},
        {"property": "border-bottom", "missing": "inherit"},
        {"property": "border-bottom-color", "missing": "inherit"},
        {"property": "border-bottom-style", "missing": "none", "values": "dashed|dotted|double|groove|hidden|inherit|inset|none|outset|ridge|solid"},
        {"property": "border-bottom-width", "missing": "inherit"},
        {"property": "border-collapse", "missing": "inherit", "values": "collapse|inherit|separate"},
        {"property": "border-color", "missing": "inherit"},
        {"property": "border-left", "missing": "inherit"},
        {"property": "border-left-color", "missing": "inherit"},
        {"property": "border-left-style", "missing": "none", "values": "dashed|dotted|double|groove|hidden|inherit|inset|none|outset|ridge|solid"},
        {"property": "border-left-width", "missing": "inherit"},
        {"property": "border-right", "missing": "inherit"},
        {"property": "border-right-color", "missing": "inherit"},
        {"property": "border-right-style", "missing": "none", "values": "dashed|dotted|double|groove|hidden|inherit|inset|none|outset|ridge|solid"},
        {"property": "border-right-width", "missing": "inherit"},
        {"property": "border-spacing", "missing": "inherit"},
        {"property": "border-style", "missing": "none", "values": "dashed|dotted|double|groove|hidden|inherit|inset|none|outset|ridge|solid"},
        {"property": "border-top", "missing": "inherit"},
        {"property": "border-top-color", "missing": "inherit"},
        {"property": "border-top-style", "missing": "none", "values": "dashed|dotted|double|groove|hidden|inherit|inset|none|outset|ridge|solid"},
        {"property": "border-top-width", "missing": "inherit"},
        {"property": "border-width", "missing": "inherit"},
        {"property": "bottom", "missing": "inherit"},
        {"property": "caption-side", "missing": "inherit", "values": "bottom|top"},
        {"property": "clear", "missing": "none", "values": "both|inherit|left|none|right"},
        {"property": "clip", "missing": "inherit"},
        {"property": "color", "missing": "inherit"},
        {"property": "content", "missing": "inherit"},
        {"property": "counter-increment", "missing": "inherit"},
        {"property": "counter-reset", "missing": "inherit"},
        {"property": "cssText", "missing": "inherit"},
        {"property": "cursor", "missing": "inherit"},
        {"property": "direction", "missing": "inherit", "values": "inherit|ltr|rtl"},
        {"property": "display", "missing": "inherit", "values": "block|inherit|inline|inline-block|inline-table|list-item|none|run-in|table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group"},
        {"property": "empty-cells", "missing": "inherit", "values": "hide|inherit|show"},
        {"property": "float", "missing": "none", "values": "inherit|left|none|right"},
        {"property": "font", "missing": "inherit"},
        {"property": "font-family", "missing": "inherit"},
        {"property": "font-size", "missing": "inherit"},
        {"property": "font-style", "missing": "inherit", "values": "inherit|italic|normal|oblique"},
        {"property": "font-variant", "missing": "inherit", "values": "inherit|normal|small-caps"},
        {"property": "font-weight", "missing": "inherit", "values": "bold|bolder|inherit|lighter|normal|100|200|300|400|500|600|700|800|900"},
        {"property": "height", "missing": "inherit"},
        {"property": "layout-flow", "missing": "inherit"},
        {"property": "layout-grid", "missing": "inherit"},
        {"property": "layout-grid-char", "missing": "none"},
        {"property": "layout-grid-line", "missing": "none"},
        {"property": "layout-grid-mode", "missing": "inherit"},
        {"property": "layout-grid-type", "missing": "inherit"},
        {"property": "left", "missing": "inherit"},
        {"property": "letter-spacing", "missing": "inherit"},
        {"property": "line-break", "missing": "inherit"},
        {"property": "line-height", "missing": "inherit"},
        {"property": "list-style", "missing": "inherit"},
        {"property": "list-style-image", "missing": "none"},
        {"property": "list-style-position", "missing": "inherit", "values": "inherit|inside|outside"},
        {"property": "list-style-type", "missing": "inherit", "values": "armenian|circle|cjk-ideographic|decimal|decimal-leading-zero|disc|georgian|hebrew|hiragana|hiragana-iroha|inherit|katakana|lower-alpha|lower-greek|lower-latin|lower-roman|none|square|upper-alpha|upper-latin|upper-roman"},
        {"property": "margin", "missing": "inherit"},
        {"property": "margin-bottom", "missing": "inherit"},
        {"property": "margin-left", "missing": "inherit"},
        {"property": "margin-right", "missing": "inherit"},
        {"property": "margin-top", "missing": "inherit"},
        {"property": "max-height", "missing": "inherit"},
        {"property": "max-width", "missing": "inherit"},
        {"property": "min-height", "missing": "inherit"},
        {"property": "min-width", "missing": "inherit"},
        {"property": "orphans", "missing": "inherit"},
        {"property": "outline", "missing": "inherit"},
        {"property": "outline-color", "missing": "inherit"},
        {"property": "outline-style", "missing": "inherit", "values": "dashed|dotted|double|groove|hidden|inherit|inset|none|outset|ridge|solid"},
        {"property": "outline-width", "missing": "inherit"},
        {"property": "overflow", "missing": "inherit", "values": "auto|hidden|inherit|scroll|visible"},
        {"property": "overflow-x", "missing": "inherit"},
        {"property": "overflow-y", "missing": "inherit"},
        {"property": "padding", "missing": "inherit"},
        {"property": "padding-bottom", "missing": "inherit"},
        {"property": "padding-left", "missing": "inherit"},
        {"property": "padding-right", "missing": "inherit"},
        {"property": "padding-top", "missing": "inherit"},
        {"property": "page-break-after", "missing": "inherit", "values": "always|auto|avoid|inherit|left|right"},
        {"property": "page-break-before", "missing": "inherit", "values": "always|auto|avoid|inherit|left|right"},
        {"property": "page-break-inside", "missing": "inherit", "values": "auto|avoid|inherit"},
        {"property": "pixelBottom", "missing": "inherit"},
        {"property": "pixelHeight", "missing": "inherit"},
        {"property": "pixelLeft", "missing": "inherit"},
        {"property": "pixelRight", "missing": "inherit"},
        {"property": "pixelTop", "missing": "inherit"},
        {"property": "pixelWidth", "missing": "inherit"},
        {"property": "posBottom", "missing": "inherit"},
        {"property": "posHeight", "missing": "inherit"},
        {"property": "position", "missing": "inherit", "values": "absolute|fixed|inherit|relative|static"},
        {"property": "posLeft", "missing": "inherit"},
        {"property": "posRight", "missing": "inherit"},
        {"property": "posTop", "missing": "inherit"},
        {"property": "posWidth", "missing": "inherit"},
        {"property": "quotes", "missing": "inherit"},
        {"property": "right", "missing": "inherit"},
        {"property": "ruby-align", "missing": "inherit"},
        {"property": "ruby-overhang", "missing": "inherit"},
        {"property": "ruby-position", "missing": "inherit"},
        {"property": "scrollbar-3dlight-color", "missing": "inherit"},
        {"property": "scrollbar-arrow-color", "missing": "inherit"},
        {"property": "scrollbar-base-color", "missing": "inherit"},
        {"property": "scrollbar-darkshadow-color", "missing": "inherit"},
        {"property": "scrollbar-face-color", "missing": "inherit"},
        {"property": "scrollbar-highlight-color", "missing": "inherit"},
        {"property": "scrollbar-shadow-color", "missing": "inherit"},
        {"property": "table-layout", "missing": "inherit", "values": "auto|fixed|inherit"},
        {"property": "text-align", "missing": "inherit", "values": "center|inherit|justify|left|right"},
        {"property": "text-align-last", "missing": "inherit"},
        {"property": "text-autospace", "missing": "none"},
        {"property": "text-decoration", "missing": "none"},
        {"property": "text-indent", "missing": "inherit"},
        {"property": "text-justify", "missing": "inherit"},
        {"property": "text-kashida-space", "missing": "inherit"},
        {"property": "text-overflow", "missing": "inherit"},
        {"property": "text-transform", "missing": "none", "values": "capitalize|inherit|lowercase|none|uppercase"},
        {"property": "text-underline-position", "missing": "inherit"},
        {"property": "top", "missing": "inherit"},
        {"property": "unicode-bidi", "missing": "inherit", "values": "bidi-override|embed|inherit|normal"},
        {"property": "vertical-align", "missing": "inherit"},
        {"property": "visibility", "missing": "inherit", "values": "collapse|hidden|inherit|visible"},
        {"property": "white-space", "missing": "inherit", "values": "inherit|normal|nowrap|pre|pre-line|pre-wrap"},
        {"property": "widows", "missing": "inherit"},
        {"property": "width", "missing": "inherit"},
        {"property": "word-break", "missing": "inherit"},
        {"property": "word-spacing", "missing": "inherit"},
        {"property": "writing-mode", "missing": "inherit"},
        {"property": "z-index", "missing": "inherit"},
        {"property": "zoom", "missing": "inherit"}
    ];

    if (event) // Firefox?
    {
        oSrcElement = (event.originalTarget) ? event.originalTarget : event.target;
    }
    else // IE or Opera
    {
        oSrcElement = window.event.srcElement;
    }
    
    if ((!oDebugWindow) || (!oSrcElement))
    {
        return true;
    }
    
    oDebugWindow.document.currentDebugElement = oSrcElement;
    
    try
    {
        oStyle = oSrcElement.style;
        oDebugWindow.document.getElementById("idTagName").innerHTML = (oSrcElement.tagName) ? "&lt;" + oSrcElement.tagName + ">" : "";
        oDebugWindow.document.getElementById("idElemId").innerHTML = (oSrcElement.id) ? oSrcElement.id.replace(/\x3c/g, "&lt;") : "[no id attribute]";
        oDebugWindow.document.getElementById("idElemName").innerHTML = (oSrcElement.name) ? oSrcElement.name.replace(/\x3c/g, "&lt;") : "[no name attribute]";
        oDebugWindow.document.getElementById("idElemTitle").innerHTML = (oSrcElement.title) ? oSrcElement.title.replace(/\x3c/g, "&lt;") : "[no title attribute]";
        oDebugWindow.document.getElementById("idElemAlt").innerHTML = (oSrcElement.alt) ? oSrcElement.alt.replace(/\x3c/g, "&lt;") : "[no alt attribute]";
        oElementTree = oSrcElement;
        
        do
        {
            sElemTree = (sElemTree) ? ((oElementTree.tagName) ? (oElementTree.tagName + "->") : "") + sElemTree : oElementTree.tagName;
            oElementTree = oElementTree.parentNode;
        } while (oElementTree);
        
        oDebugWindow.document.getElementById("idElemTree").innerHTML = sElemTree;
        oElementTree = oSrcElement;
        
        if (oElementTree.className)
        {
            do
            {
                sClassTree = (sClassTree) ? ((oElementTree.className) ? (oElementTree.className + "->") : "") + sClassTree : oElementTree.className;
		        oElementTree = oElementTree.parentNode;
	        } while (oElementTree);

	        oDebugWindow.document.getElementById("idClassTree").innerHTML = sClassTree;
	    }
	    else
	    {
	        if (oDebugWindow.document.getElementById("idClassTree").innerText) // Hack for Opera, IE will go along for the ride
	        {
	            oDebugWindow.document.getElementById("idClassTree").innerText = "";
	            oDebugWindow.document.getElementById("idClassTree").innerHTML = "";
	        }
	        else
	        {
	            oDebugWindow.document.getElementById("idClassTree").innerHTML = "";
	        }
	    }
	    
	    oAttributes = oSrcElement.attributes;
	    
	    for (var i = 0; i < oAttributes.length; i++)
	    {
	        if (oAttributes[i].specified)
	        {
	            sAttributes += oAttributes[i].name + "=&quot;" + oAttributes[i].value.replace("<", "&lt;") + "&quot; ";
	        }
	    }
	    
	    if (sAttributes.length > 0)
	    {
	        oDebugWindow.document.getElementById("idAttributes").innerHTML = sAttributes;
	    }
	    
        for (var i = 0; i < oStyles.length; i++)
        {
            sStyle = getStyle(oSrcElement, oStyles[i].property);
            
            if (sStyle)
            {
                bMissing = false;
            }
            else
            {
                bMissing = true;
                sStyle = oStyles[i].missing;
            }

            sStyles += "<br/>&nbsp;&nbsp;&nbsp;&nbsp;" + ((!bMissing) ? oStyles[i].property.bold().fontcolor("red") : oStyles[i].property) + ": ";
        
            if (oStyles[i].values && oStyles[i].values.indexOf(sStyle) > -1)
            {
                sStyles += "<select id='" + oStyles[i].property + "' onchange='overrideStyle(\"" + oStyles[i].property + "\");'>";
                
                var sStyleList = oStyles[i].values.split("|");
                
                for (var j = 0; j < sStyleList.length; j++)
                {
                    sStyles += "<option label='" + sStyleList[j] + "' value='" + sStyleList[j] + "' " + ((sStyleList[j] === sStyle) ? "selected" : "") + ">" + sStyleList[j] +
                                "</option>";
                }
                
                sStyles += "</select>";
            }
            else
            {
                sStyles += "<input id='" + oStyles[i].property + "' type='text' value='" + sStyle + "' size='" + sStyle.length + "' onchange='overrideStyle(\"" + oStyles[i].property + "\");'/>";
            }

            sStyles += ";";
        }

        oDebugWindow.document.getElementById("idStyles").innerHTML = sStyles;
    }
    catch (ex)
    {
        // The biggest thing that seems to cause problems is the debug page unloading
        // while there are still events to process, causing a security error (because
        // the page is no longer there). So just assume any exceptions mean we're
        // done debugging and remove the onmouseover event.
        document.body.onmouseover = null;
        alert("Exception occurred in DebugElems()\n\n" + ex);
    }
    
    return true;
}