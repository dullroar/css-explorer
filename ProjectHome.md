The purpose of these scripts is to allow for the debugging of HTML and CSS content using nothing more than the onmouseover event, showing the cascade results as ultimately rendered. It can be invoked in one of two ways:

1) Non-instrusive (preferred) - add a bookmarklet to your favorites/bookmarks. Using this method, you can debug CSS styles on any Web page, whether you host it or not.

2) Intrusive (deprecated) - place a script element in the 

&lt;head&gt;

 section of
the page to be debugged.

Both will cause another window to open containing debug information for the page this script was called from. Then you can line the two pages up side by side or with the debug page behind the main window but still visible and then as you mouse over places in the main window, the debug window will show you element tags, ids, titles, names, alt text, the element hierarchy, the class hierarchy (if any) and all the styles being applied to the element. You can also update the style(s) of the element being hovered over on the original page from this debug page. There are tools and add-ins that do this, but this allows the information to be seen without installing anything on the browser, and attempts to work on IE, Firefox, Opera and Safari.

This script has been tested using IE 6 & 7, Firefox 2 (Windows and Linux), Opera 9 (Windows) and Safari 3 (beta - Windows). It does NOT work on Konqueror, at least not when launched by bookmarklet (since Konqueror doesn't support the javascript: URL binding, at least not that I know of).

See comments in the code for more details.

Written by Jim Lehmer.