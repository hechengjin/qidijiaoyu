function eID(elm) {
  return document.getElementById(elm);  // create short cut to getElementById()
}

window.onload=function(){
    initInfo();
}

function initInfo() {
  document.title = post.title;
  eID("content").innerHTML = post.content;
  if( post.attachment.length <= 0 ){
    eID("videoInfo").setAttribute("hidden", true);
  } else {
    eID("videoInfo").removeAttribute("hidden");
  }
}

function loadCaptions(track) {
// retrive cues for track element
  var cues = track.track.cues;
  var list = document.getElementById('results');
  for (i = 0; i < cues.length; i++)
  {
    var x = cues[i].getCueAsHTML(); //get the text of the cue
    var option = document.createElement("option"); // create an option in the select list
    option.text = x.textContent.replace('|','').replace('|','').replace('|','');        // assign the text to the option
    option.setAttribute('data-time', cues[i].startTime);  // assign an attribute called data-time to option
   // list.add(option);       // add the new option
  }
}

function playCaption(control)
{
  var o = control.options[control.options.selectedIndex];  //get the option the user clicked
  var t = o.getAttribute('data-time');        // get the start time of that option
  var video = document.getElementById('video');   // get video element.
  video.currentTime = t - 0.1;                //  move the video to start at the time we want (subtrackting a fudge factor)
}

function search(text)
{
  var cues = eID('track').track.cues;     // retrieve a list of cues from current track
  var list = eID('results');              // get the select box object
  list.innerHTML = '';                    // clear the select box
  for (i = 0; i < cues.length; i++) {     // scan through list of cues
    var cuetext = cues[i].getCueAsHTML().textContent;  // get the text content of the current element in cue lists
    if (cuetext.toLowerCase().indexOf(text.toLowerCase()) != -1)  // does the cue contain the key we're looking for?
    {                                                             // if a match, create a new option to add to the select box
      var option = document.createElement("option");
      option.text = cuetext;
      option.setAttribute('data-time', cues[i].startTime);
      list.add(option);
    }
  }
}

function play(url,content,remarks,recordId){

  $("#video").attr("src",url);
  //setTimeout(function(){$("#track").attr("src",remarks);}, 2000);
  $("#track").attr("src",remarks);
  eID("content").innerHTML = content;
  //eID("remarks").innerHTML = remarks;
  eID("recordId").innerHTML = recordId;
}

function getVtt(postId){
  if(eID("recordId").innerHTML.length > 0 ){
    alert("../vtts/"+postId+"_"+eID("recordId").innerHTML + ".vtt");
  } else{
    alert("../vtts/"+postId+ ".vtt");
  }

}
