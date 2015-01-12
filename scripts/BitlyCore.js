function IncludeJavaScript(jsFile){
  document.write('<script type="text/javascript" src="' + jsFile + '"></script>');
}
function IncludeCss(cssFile){
  document.write('<link href="' + cssFile + '" rel="stylesheet" type="text/css" />');
}

IncludeCss('./css/style.css');
IncludeCss('./css/tabs-accordion.css');
IncludeCss('./css/overlay-apple.css');

IncludeJavaScript('http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js');
IncludeJavaScript('http://cdn.jquerytools.org/1.2.4/jquery.tools.min.js');
IncludeJavaScript('scripts/base64_helper.js');
IncludeJavaScript('http://bit.ly/javascript-api.js?version=latest&login=???&apiKey=???');
IncludeJavaScript('scripts/bitly_helper.js');
IncludeJavaScript('scripts/CodeMirror-0.8/js/codemirror.js');
IncludeJavaScript('scripts/cookie.js');
IncludeJavaScript('scripts/main.js');

