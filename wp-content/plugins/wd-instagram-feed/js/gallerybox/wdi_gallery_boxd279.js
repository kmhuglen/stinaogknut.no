var isPopUpOpened=false;function wdi_spider_createpopup(url,current_view,width,height,duration,description,lifetime,currentFeed){url=url.replace(/&#038;/g,'&');if(isPopUpOpened){return};isPopUpOpened=true;if(wdi_spider_hasalreadyreceivedpopup(description)||wdi_spider_isunsupporteduseragent()){return;}
jQuery("html").attr("style","overflow:hidden !important;");jQuery("#wdi_spider_popup_loading_"+ current_view).css({display:"block"});jQuery("#wdi_spider_popup_overlay_"+ current_view).css({display:"block"});jQuery.ajax({type:'POST',url:url,dataType:'text',data:{action:'WDIGalleryBox',image_rows:JSON.stringify(currentFeed.parsedData),feed_id:currentFeed.feed_row['id'],feed_counter:currentFeed.feed_row['wdi_feed_counter'],},success:function(response){var popup=jQuery('<div id="wdi_spider_popup_wrap" class="wdi_spider_popup_wrap" style="'+' width:'+ width+'px;'+' height:'+ height+'px;'+' margin-top:-'+ height/2+'px;'+' margin-left: -'+ width/2+'px; ">'+
response+'</div>').hide().appendTo("body");wdi_spider_showpopup(description,lifetime,popup,duration);jQuery("#wdi_spider_popup_loading_"+ current_view).css({display:"none !important;"});}});}
function wdi_spider_showpopup(description,lifetime,popup,duration){isPopUpOpened=true;popup.show();wdi_spider_receivedpopup(description,lifetime);}
function wdi_spider_hasalreadyreceivedpopup(description){if(document.cookie.indexOf(description)>-1){delete document.cookie[document.cookie.indexOf(description)];}
return false;}
function wdi_spider_receivedpopup(description,lifetime){var date=new Date();date.setDate(date.getDate()+ lifetime);document.cookie=description+"=true;expires="+ date.toUTCString()+";path=/";}
function wdi_spider_isunsupporteduseragent(){return(!window.XMLHttpRequest);}
function wdi_spider_destroypopup(duration){if(document.getElementById("wdi_spider_popup_wrap")!=null){wdi_comments_manager.popup_destroyed();if(typeof jQuery().fullscreen!=='undefined'&&jQuery.isFunction(jQuery().fullscreen)){if(jQuery.fullscreen.isFullScreen()){jQuery.fullscreen.exit();}}
if(typeof enable_addthis!="undefined"&&enable_addthis){jQuery(".at4-share-outer").hide();}
setTimeout(function(){jQuery(".wdi_spider_popup_wrap").remove();jQuery(".wdi_spider_popup_loading").css({display:"none"});jQuery(".wdi_spider_popup_overlay").css({display:"none"});jQuery(document).off("keydown");jQuery("html").attr("style","overflow:auto !important");},20);}
isPopUpOpened=false;var isMobile=(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));var viewportmeta=document.querySelector('meta[name="viewport"]');if(isMobile&&viewportmeta){viewportmeta.content='width=device-width, initial-scale=1';}
var scrrr=jQuery(document).scrollTop();window.location.hash="";jQuery(document).scrollTop(scrrr);clearInterval(wdi_playInterval);}
Object.size=function(obj){var size=0,key;for(key in obj){if(obj.hasOwnProperty(key))size++;}
return size;};function wdi_spider_ajax_save(form_id,image_id){wdi_comments_manager.init(image_id);return false;}
wdi_comments_manager={media_id:'',mediaComments:[],load_more_count:10,commentCounter:0,currentKey:-1,init:function(image_id){if(this.currentKey!=image_id){this.currentKey=image_id;this.reset_comments();}
else{}},reset_comments:function(){jQuery('#wdi_load_more_comments').remove();jQuery('#wdi_added_comments').html('');this.commentCounter=0;this.media_id=wdi_data[this.currentKey]['id'];this.getAjaxComments(this.currentKey);},popup_destroyed:function(){this.media_id='';this.mediaComments=[];this.commentCounter=0;this.currentKey=-1;},showComments:function(comments,count){if(Object.size(comments)-this.commentCounter-count<0||count===undefined){count=Object.size(comments)-this.commentCounter;}
var counter=this.commentCounter;for(i=Object.size(comments)-counter-1;i>=Object.size(comments)-counter-count;i--){this.commentCounter++;var commentText=(comments[i]['text']);commentText=this.filterCommentText(commentText);var username=(comments[i]['from']['username']);var profile_picture=(comments[i]['from']['profile_picture']);var singleComment=jQuery('<div class="wdi_single_comment"></div>');singleComment.append(jQuery('<p class="wdi_comment_header_p"><span class="wdi_comment_header"><a target="_blank" href="//instagram.com/'+username+'"><img style="height:25px;width:25px;border-radius:25px" src="'+profile_picture+'">   '+username+'</a></span><span class="wdi_comment_date">'+wdi_front.convertUnixDate(comments[i]['created_time'])+'</span></p>'));singleComment.append(jQuery('<div class="wdi_comment_body_p"><span class="wdi_comment_body"><p>'+commentText+'</p></span></div>'));jQuery('#wdi_added_comments').prepend(singleComment);}
this.updateScrollbar();},updateScrollbar:function(){var wdi_comments=jQuery('#wdi_comments');var wdi_added_comments=jQuery('#wdi_added_comments');jQuery('.wdi_comments').attr('class','wdi_comments');jQuery('.wdi_comments').html('');jQuery('.wdi_comments').append(wdi_comments);jQuery('.wdi_comments').append(wdi_added_comments);if(typeof jQuery().mCustomScrollbar!=='undefined'){if(jQuery.isFunction(jQuery().mCustomScrollbar)){jQuery(".wdi_comments").mCustomScrollbar({scrollInertia:250});}}
jQuery('.wdi_comments_close_btn').on('click',wdi_comment);},getAjaxComments:function(){var access_token=wdi_front.access_token;jQuery.ajax({type:"POST",url:'https://api.instagram.com/v1/media/'+this.media_id+'/comments?access_token='+access_token,dataType:'jsonp',success:function(response){if(response==''||response==undefined||response==null){errorMessage='Network Error, please try again later :(';alert(errorMessage);return;}
if(response['meta']['code']!=200){errorMessage=response['meta']['error_message'];alert(errorMessage);return;}
wdi_comments_manager.mediaComments=response['data'];var currentImage=wdi_data[wdi_comments_manager.currentKey];currentImage['comments_data']=response['data'];wdi_comments_manager.showComments(currentImage['comments_data'],wdi_comments_manager.load_more_count);wdi_comments_manager.ajax_comments_ready(response['data']);}});},ajax_comments_ready:function(response){this.createLoadMoreAndBindEvent();},createLoadMoreAndBindEvent:function(){jQuery('#wdi_added_comments').prepend(jQuery('<p id="wdi_load_more_comments" class="wdi_load_more_comments">load more comments</p>'));jQuery('.wdi_comment_container #wdi_load_more_comments').on('click',function(){jQuery(this).remove();wdi_comments_manager.showComments(wdi_comments_manager.mediaComments,wdi_comments_manager.load_more_count);wdi_comments_manager.createLoadMoreAndBindEvent();});},filterCommentText:function(comment){var commentArray=comment.split(' ');var commStr='';for(var i=0;i<commentArray.length;i++){switch(commentArray[i][0]){case'@':{commStr+='<a target="blank" class="wdi_comm_text_link" href="//instagram.com/'+commentArray[i].substring(1,commentArray[i].length)+'">'+commentArray[i]+'</a> ';break;}
case'#':{commStr+='<a target="blank" class="wdi_comm_text_link" href="//instagram.com/explore/tags/'+commentArray[i].substring(1,commentArray[i].length)+'">'+commentArray[i]+'</a> ';break;}
default:{commStr+=commentArray[i]+' ';}}}
commStr=commStr.substring(0,commStr.length-1);return commStr;}}
function wdi_spider_set_input_value(input_id,input_value){if(document.getElementById(input_id)){document.getElementById(input_id).value=input_value;}}
function wdi_spider_form_submit(event,form_id){if(document.getElementById(form_id)){document.getElementById(form_id).submit();}
if(event.preventDefault){event.preventDefault();}
else{event.returnValue=false;}}
function wdi_spider_check_required(id,name){if(jQuery('#'+ id).val()==''){alert(name+'* '+ wdi_objectL10n.wdi_field_required);jQuery('#'+ id).attr('style','border-color: #FF0000;');jQuery('#'+ id).focus();return true;}
else{return false;}}
function wdi_spider_check_email(id){if(jQuery('#'+ id).val()!=''){var email=jQuery('#'+ id).val().replace(/^\s+|\s+$/g,'');if(email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)==-1){alert(wdi_objectL10n.wdi_mail_validation);return true;}
return false;}}
function wdi_captcha_refresh(id){if(document.getElementById(id+"_img")&&document.getElementById(id+"_input")){srcArr=document.getElementById(id+"_img").src.split("&r=");document.getElementById(id+"_img").src=srcArr[0]+'&r='+ Math.floor(Math.random()*100);document.getElementById(id+"_img").style.display="inline-block";document.getElementById(id+"_input").value="";}}
function wdi_play_pause($this){var video=$this.get(0);var regex=/firefox/i;var firefox=false;if(navigator.userAgent.match(regex)){firefox=true;}
if(!firefox){if(!video.paused){video.pause();}else{video.play();}}}