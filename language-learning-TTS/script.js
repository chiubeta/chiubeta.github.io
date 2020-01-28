var synth;
var categories;

var init = function(){
    synth = window.speechSynthesis;
    initListener();
    initVoiceSelect();
    
    $("#categories").hide();
};

var initVoiceSelect = function() {
    var voiceSelect = document.getElementById("langSelect");
    var populateVoiceList = function() {
        var voices = synth.getVoices() || [];
        voiceSelect.innerHTML = '';
        for(var i=0,len=voices.length; i<len ; i++) {
            var option = document.createElement('option');
            option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

            option.setAttribute('data-lang', voices[i].lang);
            option.setAttribute('data-name', voices[i].name);
            option.setAttribute('data-index', i);
            if(["en-US", "en_US"].includes(voices[i].lang)){ 
                // default: Google US English (en-US)
                option.setAttribute('selected', true);
                synthesis.voiceObject = voices[i];
            }
            voiceSelect.appendChild(option);
        }
    }

    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }
};

var handleFile = function() {
    var fileList = this.files;
    
    if (fileList.length <= 0) {
        return false;
    }

    var fr = new FileReader();

    fr.onload = function(e) { 
        var content;
        if(fileList.item(0).type == "application/json"){
            content = JSON.stringify(JSON.parse(e.target.result), null, 2);
        } else {
            content = e.target.result;
            if(/\.md$/.test(fileList.item(0).name)){
                generateCategories(content);
            }
        }
        document.getElementById('content').value = content;
    }

    fr.readAsText(fileList.item(0));
};

var generateCategories = function(content) {
    categories = []
    $("#categories > .panel-body").html("");

    var categoryBtns = [];
    var textAry = [];
    var contentAry = content.trim().split("\n");
    for(var i=0,len=contentAry.length; i<len; i++){
        var text = contentAry[i].trim();
        if(/^# /.test(text) || text == ""){ // Ignore root or blank row
            continue;
        } else if(/^## /.test(text)){ // Categorized by second text
            if(textAry.length > 0){
                categories.push(textAry);
            }
            categoryBtns.push('<button class="btn btn-success" style="margin:5px" data-index='+categoryBtns.length+'>'+text.substr(3)+'</button>');
            textAry = [];
        } else {
            // Trim markdown format
            if(text[0] == "-"){
                text = text.substr(2);
            } else if(text[0] == "#"){
                text = text.substr(text.indexOf(" ")+1);
            }
            
            textAry.push(text);
        }
    }
    categories.push(textAry); // The last category
    $("#categories > .panel-body").html(categoryBtns.join(""));
    $("#categories").show();
};

var initListener = function() {
    $("#langSelect").on("change", function(e){
        var index = $(e.target).find("option:checked").data("index");
        synthesis.voiceObject = synth.getVoices()[index];
    });
    $("#selectFile").on("change", handleFile);
    $("#categories").on("click", "button", function(e){
        var categoryIndex = $(e.target).data("index");
        synthesis.speakContent(categories[categoryIndex], true);
    });
    $("#speak").on("click", function(e){
        var content = document.getElementById('content').value.trim();
        synthesis.speakContent(content);
    });
    $("#pause").on("click", synthesis.pauseAndResume);
    $("#stop").on("click", synthesis.stop);
    $("#repeat").on("change", synthesis.repeat);
};

var synthesis = {
    speakQueue: [],
    speakQueueIndex: 0,
    voiceObject: null,
    isRepeat: false,
    getDefaultVoice: function(){
        var voices = synth.getVoices() || [];
        for(var i=0,len=voices.length; i<len ; i++) {
            if(voices[i].default || ["TW", "tw"].includes(voices[i].lang)){
                return voices[i];
            }
        }
        return null;
    },
    speakContent: function(content, isArray){
        synthesis.speakQueue = [];
        synthesis.speakQueueIndex = 0;
        if(isArray){ // array
            synthesis.speakQueue = content;
        } else { // string
            var contentAry = content.trim().split("\n");
            for(var i=0,len=contentAry.length; i<len; i++){
                synthesis.speakQueue.push(contentAry[i].trim());
            }
        }
        synthesis.speak();
    },
    speak: function() {
        var idx = synthesis.speakQueueIndex;
        if(idx < synthesis.speakQueue.length){
            var text = synthesis.speakQueue[idx];
            synthesis.speakQueueIndex++;
            if(/^[a-zA-Z0-9]/.test(text)){
                var utterThis = synthesis.setUtterInfo(text);
                var interval = document.getElementById("intervalInput").value;
                utterThis.onend = synthesis.speak;
                setTimeout(function(){
                    synth.speak(utterThis);
                    document.getElementById("speaking").value = text;
                }, interval * 1000);
            } else {
                synthesis.speak();
            }
        } else if(synthesis.isRepeat){
            synthesis.speakQueueIndex = 0;
            synthesis.speak();
        }
    },
    setUtterInfo: function(text) {
        var utterThis = new SpeechSynthesisUtterance(text);
        // if(!/^[a-zA-Z0-9]/.test(text)){
        //     // 非英文或數字 => 採用預設語言
        //     utterThis.voice = synthesis.getDefaultVoice();
        // } else {
            utterThis.voice = synthesis.voiceObject;
        // }
        utterThis.volume = document.getElementById("volumeInput").value;
        utterThis.rate = document.getElementById("rateInput").value;
        utterThis.pitch = document.getElementById("pitchInput").value;
        return utterThis;
    },
    pauseAndResume: function() {
        if($("#pause").data("status") == "pause"){
            $("#pause").text("pause").data("status", "resume");
            synth.resume();
        } else {
            $("#pause").text("resume").data("status", "pause");
            synth.pause();
        }
    },
    stop: function() {
        synth.cancel();
        synthesis.speakQueue = [];
    },
    repeat: function(e) {
        synthesis.isRepeat = e.target.checked;
    }
};

var utils = {
    splitChinese: function(text){
        // "123你好AB我是7cd89" => ["123", "你好", "AB", "我是", "7cd89"]
        return text.match(/[a-zA-Z0-9' ]+[?!.,:;]* ?|[^a-zA-Z0-9 ]+/g);
    }
};

window.onload = init;