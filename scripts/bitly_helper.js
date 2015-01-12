var BITLY_SHORTEN_URL = 'http://api.bit.ly/v3/shorten';
var BITLY_EXPAND_URL = 'http://api.bit.ly/v3/expand';
var DEFAULT_FORMAT = 'json'
var SHORTEN_CALLBACK = 'bitly.jsonCallback';
var JSON_CALLBACK = 'bitly.jsonCallback2';
var CONTENT_CALLBACK = 'bitly.jsonCallback3';

//TODO: Move to page lookup
var LOGIN = '???';
var API_KEY = '???';


var g_type;

var BitlyHelper = Class.create();
BitlyHelper.prototype = {
    initialize: function(linkDivName, contentDivName, nicknameDivName, embedDivName) {
      this.linkDivName = linkDivName;
      this.contentDivName = contentDivName;
      this.nicknameDivName = nicknameDivName;
      this.embedDivName = embedDivName
    },
    sayLink: function(message) {
      hash = BitlyClient.extractBitlyHash(message);
      appendCookie(g_type, hash, $(this.nicknameDivName).value);
      refreshRecent();
    },
    sayPreview: function(message, type) {
//TODO: kinda hacked it here.
      if (message.substring(0,1) != '<'){
        if (window.execScript){
          window.execScript(message);
          return;
        }
        //TODO: this is untested. need to verify it works in non-IE browsers
        var fn = function() {
          window.eval.call(window, message);
        };
       fn();

      }else
      {
        Element.insert(this.contentDivName, message);
      }
    },
    shortenURL: function(obj, p_text, type) {
        g_type = type;
	str = obj.encode(obj, p_text);

        BitlyClient.shorten('http://tiki.com/'+str, SHORTEN_CALLBACK);
    },
    loadSegment: function(data){
      var bitly_link = '';
      for (var r in data.results) {
        bitly_link = data.results[r]['longUrl'];
        break;
      }
      str2 = this.decode(bitly_link);
      //alert(str2);
      editor.setCode(str2);
    },
    jsonCallback: function(data){
      var bitly_link = '';
      for (var r in data.results) {
        bitly_link = data.results[r]['shortUrl'];
        break;
      }

      this.sayLink(bitly_link, g_type);
    },
    jsonCallback2: function(data){
      var bitly_link = '';
      for (var r in data.results) {
        bitly_link = data.results[r]['longUrl'];
        break;
      }
      str2 = this.decode(bitly_link);
      this.handleJSONResponse(this, str2);
    },
    jsonCallback3: function(data){
      var bitly_link = '';
      for (var r in data.results) {
        bitly_link = data.results[r]['longUrl'];
        break;
      }
      str2 = this.decode(bitly_link);
      this.sayPreview(str2, g_type);
    },
    getContentByHash: function(obj, p_hash, type) {
        g_type = type;

        BitlyClient.expand('http://bit.ly/'+p_hash, CONTENT_CALLBACK);
    },
    getContentByURL: function(obj, p_url, type) {
        g_type = type;

        BitlyClient.expand(p_url, 'unknown');

	str = obj.decode(obj, transport.responseText, g_type);
        obj.sayPreview(str);
    },
    getJSONByURL: function(obj, p_url) {
        BitlyClient.expand(p_url, JSON_CALLBACK);
    },
    handleJSONResponse: function(obj, str)  {
      try{
        var pageLayout = eval(str);
        for (var i=0; i<pageLayout.length; i++){
          for (var j=0; j<pageLayout[i].js.length; j++){
            obj.getContentByHash(obj, pageLayout[i].js[j], 'js');
          }
          for (var k=0; k<pageLayout[i].html.length; k++){
            obj.getContentByHash(obj, pageLayout[i].html[k], 'html');
          }
        }
      }catch(e){alert(e.description);}
    },
    encode: function(obj, p_text) {
        var str = Base64.encode(p_text);
        for(var i=1; i<= Math.round(str.length/61); i++){
            str = obj.setCharAt(str, 61*i, '/');
        }
        return str;
    },
    decode: function(p_text) {
        new_str = p_text.substr(16,p_text.length);
        for(var i=1; i<= Math.round(new_str.length/61); i++){
            new_str = this.removeCharAt(new_str, (61*i)-i+1);
        }
        return Base64.decode(new_str);
    },
    setCharAt: function(str, index, chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index);
    },
    removeCharAt: function(str, index) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + str.substr(index+1);
    }
};
