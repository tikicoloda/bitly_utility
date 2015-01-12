        var $j = jQuery.noConflict();
        var editor;
	var bitly = new BitlyHelper('bitly_link', '', 'nickname', '');
        var type = 'text';
        var jsSelectionHolder = new Array();
        var htmlSelectionHolder = new Array();

        function jsonBuild(hash, type){
          if (type=='text'){
            iframeText = '&lt;iframe src="http://'+ window.location.hostname +'/embed.html?hash='+ hash +'\" /&gt;';
            overlayHtml = '<div id="innerOverlay" class="apple_overlay">'+
                          '<div id="embedCopyButtonDiv" class="copyButtonDiv"><input id="embedLink" value="' +
                          encodeURI(iframeText) +
                          '" disabled></input><img id="embedInputImg" src="img/global/gradient/gray.png"/></div>' +
                          '  <iframe style="width:400px;height:350px;" src="./embed.html?hash='+hash+'"></iframe>'+
                          '  <div id="social">' +
                          '    <img src="twitter.gif" alt="twitter"/>' +
                          '    <img src="digg.gif" alt="digg"/>' +
                          '    <img src="reddit.gif" alt="reddit"/>' +
                          '    <img src="facebook.gif" alt="facebook"/>' +
                          '    <img src="googlewave.gif" alt="googlewave"/>' +
                          '  </div>' +
                          '</div>';
            $("overlay").update(overlayHtml);

          $j("#embedCopyButtonDiv").hover(
            function() {$j("#embedInputImg").animate({ 
                            left: "40%",
                            opacity: 1
                          }, 1500 );
                       },
            function() {$j("#embedInputImg").animate({ 
                            left: "100%",
                            opacity: 0.4
                          }, 1500 );
                       }
          );

          $j("#embedCopyButtonDiv").click(function(event){
            if( window.clipboardData && clipboardData.setData )
            {
              clipboardData.setData("Text", $j("#embedLink").val());
            }
          });


            $j("#innerOverlay").overlay({load:true});
            return;
          }
          if (editor == null){
            if (type=='html')
              htmlSelectionHolder.push('"'+hash+'"');
            if (type=='js')
              jsSelectionHolder.push('"'+hash+'"');

            strJSON = '[{"js":['+jsSelectionHolder.toString() +'],"html":[' + htmlSelectionHolder.toString() +"]}]";
            $('link_Content').value = strJSON;
          }
          else{
            BitlyClient.expand('http://bit.ly/'+hash, 'bitly.loadSegment');
          }
        }

        $j(document).ready(function() {
          try{
            refreshRecent();
            goHTML();
          } catch(e){};
        });

        function makeLinkBtnClick(){
          if (type != 'text')
            var strContent = editor.getCode();
          else
            var strContent = $('link_Content').value;
          
          bitly.shortenURL(bitly, strContent, type);
        }

        function refreshRecent(){
          var strHistory = '';
          strHistory += '<div id="accordion"><h2 class="current">HTML Snippets</h2><div class="pane" style="display:block"><ul>';

          html = readCookie('html');
          if (html != null){
            var harr = html.split('~');
            for(var hCtr=0;hCtr<harr.length;hCtr++) {
              var c = eval(harr[hCtr]);
              strHistory += '<li onclick="jsonBuild('+"'"+c[0].hash+"','html'"+');">'+c[0].nickname+'</li>';
            }
          }

          strHistory += '</ul></div>';
          strHistory += '<h2>JavaScript Snippets</h2><div class="pane"><ul>';

          js = readCookie('js');
          if (js != null){
            var jarr = js.split('~');
            for(var jCtr=0;jCtr<jarr.length;jCtr++) {
              var c = eval(jarr[jCtr]);
              strHistory += '<li onclick="jsonBuild('+"'"+c[0].hash+"','js'"+');">'+c[0].nickname+'</li>';
            }
          }

          strHistory += '</ul></div>';
          strHistory += '<h2>Embeddable Pages</h2><div class="pane"><ul>';

          text = readCookie('text');
          if (text != null){
            var tarr = text.split('~');
            for(var tCtr=0;tCtr<tarr.length;tCtr++) {
              var c = eval(tarr[tCtr]);
              strHistory += '<li onclick="jsonBuild('+"'"+c[0].hash+"','text'"+');">'+c[0].nickname+'</li>';
            }
          }

          strHistory += '</ul></div></div>';

          Element.update('recent', strHistory);
          $j("#accordion").tabs("#accordion div.pane", {tabs: 'h2', effect: 'slide', initialIndex: 0});
        }

        function goText(){
          jsSelectionHolder = new Array();
          htmlSelectionHolder = new Array();

          try{
            if (editor != null)
              editor.toTextArea();

            editor = null;

            $('link_Content').value = "Select HTML &/or JavaScript Snippets from the Tree.";
            type = 'text';

          } catch(e){
            alert(e.description);
          }

          return false;
        }

        function goJavascript(){
          try{
            if (editor != null)
              editor.toTextArea();

            $('link_Content').value = "//Enter JavaScript Here...";
            type = 'js';

            editor = new CodeMirror.fromTextArea('link_Content', {
              width: "400px",
              height: "220px",
              content: $('link_Content').value,
              parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
              stylesheet: "scripts/CodeMirror-0.8/css/jscolors.css",
              path: "scripts/CodeMirror-0.8/js/",
              autoMatchParens: true,
              lineNumbers: true
            });
          } catch(e){
            alert(e.description);
          }

          return false;
        }

        function goHTML(){
          try{
            if (editor != null)
              editor.toTextArea();

            $('link_Content').value = "<!--Enter HTML Here... -->";
            type = 'html';

            editor = new CodeMirror.fromTextArea('link_Content', {
              width: "400px",
              height: "220px",
              content: $('link_Content').value,
              parserfile: ["parsexml.js"],
              stylesheet: "scripts/CodeMirror-0.8/css/xmlcolors.css",
              path: "scripts/CodeMirror-0.8/js/",
              autoMatchParens: true,
              lineNumbers: true
            });

          } catch(e){
            alert(e.description);
          }

          return false;
        }

        function goFile(){
          alert('File upload is not currently supported.');
          return false;
        }