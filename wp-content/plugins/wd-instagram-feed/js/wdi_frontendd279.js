if(typeof wdi_front=='undefined'){wdi_front={type:'not_declared'};}
jQuery(document).ready(function(){if(wdi_front['type']!='not_declared'){wdi_front.clickOrTouch=wdi_front.detectEvent();wdi_front.globalInit();}else{return;}});wdi_front.detectEvent=function(){var isMobile=(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));if(isMobile){return"touchend";}else{return'click';}}
wdi_front.globalInit=function(){var num=wdi_front['feed_counter'];for(var i=0;i<=num;i++){var currentFeed=new WDIFeed(window['wdi_feed_'+ i]);currentFeed.instagram=new WDIInstagram();currentFeed.instagram.filterArguments={feed:currentFeed};currentFeed.instagram.filters=[{'where':'getUserRecentMedia','what':function(response,args,cArgs){return args.feed.conditionalFilter(response,cArgs);}},{'where':'getTagRecentMedia','what':function(response,args,cArgs){return args.feed.conditionalFilter(response,cArgs);}},{'where':'requestByUrl','what':function(response,args,cArgs){return args.feed.conditionalFilter(response,cArgs);}},];currentFeed.instagram.addToken(currentFeed['feed_row']['access_token']);wdi_front.access_token=currentFeed['feed_row']['access_token'];currentFeed.dataStorageRaw=[];currentFeed.dataStorage=[];currentFeed.dataStorageList=[];currentFeed.allResponseLength=0;currentFeed.currentResponseLength=0;currentFeed.temproraryUsersData=[];currentFeed.removedUsers=0;currentFeed.nowLoadingImages=true;currentFeed.imageIndex=0;currentFeed.resIndex=0;currentFeed.currentPage=1;currentFeed.userSortFlags=[];currentFeed.customFilterChanged=false;currentFeed.maxConditionalFiltersRequestCount=10;currentFeed.instagramRequestCounter=0;currentFeed.conditionalFilterBuffer=[];currentFeed.stopInfiniteScrollFlag=false;window.onload=function(){for(var i=0;i<=wdi_front.feed_counter;i++){window['wdi_feed_'+ i]['nowLoadingImages']=false;}}
if(currentFeed.feed_row.feed_type=='masonry'){currentFeed.displayedData=[];}
if(currentFeed.feed_row.feed_display_view=='pagination'){currentFeed.feed_row.resort_after_load_more=0;if(currentFeed.feed_row.feed_type!='image_browser'){currentFeed.feed_row.load_more_number=parseInt(currentFeed.feed_row.pagination_per_page_number);currentFeed.feed_row.number_of_photos=(1+ parseInt(currentFeed.feed_row.pagination_preload_number))*currentFeed.feed_row.load_more_number;}else{currentFeed.feed_row.number_of_photos=1+ parseInt(currentFeed.feed_row.image_browser_preload_number);currentFeed.feed_row.load_more_number=parseInt(currentFeed.feed_row.image_browser_load_number);}
currentFeed.freeSpaces=(Math.floor(currentFeed.feed_row.pagination_per_page_number/currentFeed.feed_row.number_of_columns)+ 1)*currentFeed.feed_row.number_of_columns- currentFeed.feed_row.pagination_per_page_number;}else{currentFeed.freeSpaces=0;}
currentFeed.galleryBox=function(image_id){wdi_spider_createpopup(wdi_url.ajax_url+'?gallery_id='+ this.feed_row['id']+'&image_id='+ image_id,wdi_front.feed_counter,this.feed_row['lightbox_width'],this.feed_row['lightbox_height'],1,'testpopup',5,this);}
wdi_responsive.columnControl(currentFeed);if(currentFeed.feed_row.feed_type=='masonry'){jQuery(window).trigger('resize');}
wdi_front.bindEvents(currentFeed);window['wdi_feed_'+ i]=currentFeed;wdi_front.init(currentFeed);}}
wdi_front.init=function(currentFeed){currentFeed.photoCounter=currentFeed.feed_row["number_of_photos"];if(wdi_front.isJsonString(currentFeed.feed_row.feed_users)){currentFeed.feed_users=JSON.parse(currentFeed.feed_row.feed_users);if(wdi_front.updateUsersIfNecessary(currentFeed)){return;};}else{alert('provided feed users are invalid or obsolete for this version of plugin');return;}
currentFeed.dataCount=currentFeed.feed_users.length;for(var i=0;i<currentFeed.feed_users.length;i++){wdi_front.instagramRequest(i,currentFeed);}
if(currentFeed.feed_row["number_of_photos"]>0){wdi_front.ajaxLoader(currentFeed);}
if(currentFeed['feed_row']['display_header']==='1'){wdi_front.show('header',currentFeed);}
if(currentFeed['feed_row']['show_usernames']==='1'){wdi_front.show('users',currentFeed);}}
wdi_front.isJsonString=function(str){try{JSON.parse(str);}catch(e){return false;}
return true;}
wdi_front.instagramRequest=function(id,currentFeed){var feed_users=currentFeed.feed_users,_this=this;switch(this.getInputType(feed_users[id]['username'])){case'hashtag':{currentFeed.instagram.getTagRecentMedia(this.stripHashtag(feed_users[id]['username']),{success:function(response){response=_this.checkMediaResponse(response);if(response!=false){_this.saveUserData(response,currentFeed.feed_users[id],currentFeed);}}});break;}
case'user':{currentFeed.instagram.getUserRecentMedia(feed_users[id]['id'],{success:function(response){response=_this.checkMediaResponse(response);if(response!=false){_this.saveUserData(response,currentFeed.feed_users[id],currentFeed);}}})
break;}}}
wdi_front.isHashtag=function(str){return(str[0]==='#');}
wdi_front.saveUserData=function(data,user,currentFeed){data['username']=user.username;data['user_id']=user.id;if(data['user_id'][0]==='#'){data['data']=wdi_front.appendRequestHashtag(data['data'],data['user_id']);}
currentFeed.usersData.push(data);currentFeed.currentResponseLength=wdi_front.getArrayContentLength(currentFeed.usersData,'data');currentFeed.allResponseLength+=currentFeed.currentResponseLength;if(currentFeed.dataCount==currentFeed.usersData.length){if(currentFeed.currentResponseLength<currentFeed.feed_row.number_of_photos&&!wdi_front.userHasNoPhoto(currentFeed)){wdi_front.loadMore('initial-keep',currentFeed);}else{wdi_front.displayFeed(currentFeed);wdi_front.applyFilters(currentFeed);if(!wdi_front.activeUsersCount(currentFeed)){if(currentFeed.feed_row.feed_display_view=='load_more_btn'){var feed_container=jQuery('#wdi_feed_'+ currentFeed.feed_row.wdi_feed_counter);feed_container.find('.wdi_load_more').addClass('wdi_hidden');feed_container.find('.wdi_spinner').addClass('wdi_hidden');}};}}}
wdi_front.userHasNoPhoto=function(currentFeed,cstData){var counter=0;var data=currentFeed.usersData;if(cstData!=undefined){data=cstData;}
for(var i=0;i<data.length;i++){if(data[i]['pagination']['next_max_id']==undefined){counter++}}
if(counter==data.length){return 1;}else{return 0;}}
wdi_front.appendRequestHashtag=function(data,hashtag){for(var i=0;i<data.length;i++){data[i]['wdi_hashtag']=hashtag;}
return data;}
wdi_front.displayFeed=function(currentFeed,load_more_number){if(currentFeed.customFilterChanged==false){var data=wdi_front.feedSort(currentFeed,load_more_number);}
var frontendCustomFilterClicked=currentFeed.customFilterChanged;if(currentFeed.customFilterChanged==true){var data=currentFeed.customFilteredData;currentFeed.parsedData=wdi_front.parseLighboxData(currentFeed,true);}
if(currentFeed.feed_row.resort_after_load_more!='1'){if(currentFeed.customFilterChanged==false){currentFeed.dataStorageList=currentFeed.dataStorageList.concat(data);}}else{if(currentFeed.customFilterChanged==false){currentFeed.dataStorageList=data;}}
if(currentFeed.feed_row.feed_type=='masonry'){wdi_front.masonryDisplayFeedItems(data,currentFeed);}
if(currentFeed.feed_row.feed_type=='thumbnails'||currentFeed.feed_row.feed_type=='blog_style'||currentFeed.feed_row.feed_type=='image_browser'){wdi_front.displayFeedItems(data,currentFeed);}
var dataLength=wdi_front.getDataLength(currentFeed);if(dataLength<currentFeed.photoCounter&&!frontendCustomFilterClicked&&currentFeed.instagramRequestCounter<=currentFeed.maxConditionalFiltersRequestCount&&!wdi_front.allDataHasFinished(currentFeed)){wdi_front.loadMore('',currentFeed);}else{wdi_front.allImagesLoaded(currentFeed);}
if(currentFeed.instagramRequestCounter>currentFeed.maxConditionalFiltersRequestCount){wdi_front.allImagesLoaded(currentFeed);if(data.length==0){currentFeed.stopInfiniteScrollFlag=true;}}
if(currentFeed.feed_row.feed_display_view=='pagination'&&currentFeed.currentPage<currentFeed.paginator){jQuery('#wdi_feed_'+ currentFeed.feed_row.wdi_feed_counter).find('#wdi_last_page').removeClass('wdi_disabled');}
currentFeed.instagramRequestCounter=0;currentFeed.conditionalFilterBuffer=[];wdi_front.updateUsersImages(currentFeed);}
wdi_front.updateUsersImages=function(currentFeed){var elements=jQuery('#wdi_feed_'+ currentFeed.feed_row.wdi_feed_counter).find('.wdi_single_user .wdi_user_img_wrap img');elements.each(function(){if(jQuery(this).attr('src')==wdi_url.plugin_url+'../images/missing.png'||jQuery(this).attr('src')==''){for(var j=0;j<currentFeed.usersData.length;j++){if(currentFeed.usersData[j]['username']==jQuery(this).parent().parent().find('h3').text()){if(currentFeed.usersData[j]['data'].length!=0){jQuery(this).attr('src',currentFeed.usersData[j]['data'][0]['images']['thumbnail']['url']);}}}}});}
wdi_front.masonryDisplayFeedItems=function(data,currentFeed){var masonryColEnds=[];var masonryColumns=[];jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' .wdi_masonry_column').each(function(){if(currentFeed.feed_row.resort_after_load_more==1){jQuery(this).html('');currentFeed.imageIndex=0;}
if(currentFeed.customFilterChanged==true){jQuery(this).html('');currentFeed.imageIndex=0;}
if(currentFeed.feed_row.feed_display_view=='pagination'){masonryColEnds.push(0);}else{masonryColEnds.push(jQuery(this).height());}
masonryColumns.push(jQuery(this));});if(currentFeed.customFilterChanged==true){currentFeed.customFilterChanged=false;}
for(var i=0;i<data.length;i++){currentFeed.displayedData.push(data[i]);if(data[i]['type']=='image'){var photoTemplate=wdi_front.getPhotoTemplate(currentFeed);}else{var photoTemplate=wdi_front.getVideoTemplate(currentFeed);}
var rawItem=data[i];var item=wdi_front.createObject(rawItem,currentFeed);var html=photoTemplate(item);var shortCol=wdi_front.array_min(masonryColEnds);var imageResolution=wdi_front.getImageResolution(data[i]);masonryColumns[shortCol['index']].html(masonryColumns[shortCol['index']].html()+ html);masonryColEnds[shortCol['index']]+=masonryColumns[shortCol['index']].width()*imageResolution;currentFeed.imageIndex++;if(currentFeed.feed_row.feed_display_view=='pagination'){if((i+ 1)%currentFeed.feed_row.pagination_per_page_number===0){currentFeed.resIndex+=currentFeed.freeSpaces+ 1;}else{currentFeed.resIndex++;}}}
currentFeed.wdi_loadedImages=0;var columnFlag=false;currentFeed.wdi_load_count=i;var wdi_feed_counter=currentFeed.feed_row['wdi_feed_counter'];var feed_wrapper=jQuery('#wdi_feed_'+ wdi_feed_counter+' img.wdi_img').on('load',function(){currentFeed.wdi_loadedImages++;checkLoaded();if(columnFlag===false){wdi_responsive.columnControl(currentFeed,1);columnFlag=true;}});function checkLoaded(){if(currentFeed.wdi_load_count===currentFeed.wdi_loadedImages&&currentFeed.wdi_loadedImages!=0){currentFeed.loadedImages=0;currentFeed.wdi_load_count=0;wdi_front.allImagesLoaded(currentFeed);}}
if(currentFeed.paginatorNextFlag==true){wdi_front.updatePagination(currentFeed,'next');}
currentFeed.infiniteScrollFlag=false;}
wdi_front.getImageResolution=function(data){var originalWidth=data['images']['standard_resolution']['width'];var originalHeight=data['images']['standard_resolution']['height'];var resolution=originalHeight/originalWidth;return resolution;}
wdi_front.getDataLength=function(currentFeed,customStorage){var length=0;if(customStorage===undefined){for(var j=0;j<currentFeed.dataStorage.length;j++){length+=currentFeed.dataStorage[j].length;}}else{for(var j=0;j<customStorage.length;j++){length+=customStorage[j].length;}}
return length;}
wdi_front.getArrayContentLength=function(array,data){var sum=0;for(var i=0;i<array.length;i++){if(array[i]['finished']=='finished'){continue;}
sum+=array[i][data].length;}
return sum;}
wdi_front.displayFeedItems=function(data,currentFeed){var wdi_feed_counter=currentFeed.feed_row['wdi_feed_counter'];var feed_wrapper=jQuery('#wdi_feed_'+ wdi_feed_counter+' .wdi_feed_wrapper');if(currentFeed.feed_row['resort_after_load_more']==='1'){feed_wrapper.html('');currentFeed.imageIndex=0;}
if(currentFeed.customFilterChanged==true){feed_wrapper.html('');currentFeed.imageIndex=0;currentFeed.customFilterChanged=false;}
var lastIndex=wdi_front.getImgCount(currentFeed)- data.length- 1;if(currentFeed.feed_row.feed_display_view=='pagination'){if(jQuery('#wdi_feed_'+ currentFeed.feed_row.wdi_feed_counter+' [wdi_page="'+(currentFeed.currentPage- 1)+'"]').length<currentFeed.feed_row.load_more_number||data.length==0){currentFeed.currentPage=(--currentFeed.currentPage<=1)?1:currentFeed.currentPage;}}
for(var i=0;i<data.length;i++){if(data[i]['type']=='image'){var photoTemplate=wdi_front.getPhotoTemplate(currentFeed);}else{var photoTemplate=wdi_front.getVideoTemplate(currentFeed);}
var rawItem=data[i];var item=wdi_front.createObject(rawItem,currentFeed);var html=photoTemplate(item);feed_wrapper.html(feed_wrapper.html()+ html);currentFeed.imageIndex++;if(currentFeed.feed_row.feed_display_view=='pagination'){if((i+ 1)%currentFeed.feed_row.pagination_per_page_number===0){currentFeed.resIndex+=currentFeed.freeSpaces+ 1;}else{currentFeed.resIndex++;}}}
jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' .wdi_feed_wrapper [wdi_index='+ lastIndex+'] .wdi_photo_title').trigger(wdi_front.clickOrTouch);jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' .wdi_feed_wrapper [wdi_index='+ lastIndex+'] .wdi_photo_title').trigger(wdi_front.clickOrTouch);currentFeed.wdi_loadedImages=0;var columnFlag=false;currentFeed.wdi_load_count=i;var wdi_feed_counter=currentFeed.feed_row['wdi_feed_counter'];var feed_wrapper=jQuery('#wdi_feed_'+ wdi_feed_counter+' img.wdi_img').on('load',function(){currentFeed.wdi_loadedImages++;checkLoaded();if(columnFlag===false){wdi_responsive.columnControl(currentFeed,1);columnFlag=true;}});function checkLoaded(){if(currentFeed.wdi_load_count===currentFeed.wdi_loadedImages&&currentFeed.wdi_loadedImages!=0){currentFeed.loadedImages=0;currentFeed.wdi_load_count=0;wdi_front.allImagesLoaded(currentFeed);}}
if(currentFeed.paginatorNextFlag==true){wdi_front.updatePagination(currentFeed,'next');}
currentFeed.infiniteScrollFlag=false;}
wdi_front.checkFeedFinished=function(currentFeed){for(var i=0;i<currentFeed.usersData.length;i++){if(currentFeed.usersData[i]['finished']==undefined){return false;}}
return true;}
wdi_front.sortingOperator=function(sortImagesBy,sortOrder){var operator;switch(sortImagesBy){case'date':{switch(sortOrder){case'asc':{operator=function(a,b){return(a['created_time']>b['created_time'])?1:-1;}
break;}
case'desc':{operator=function(a,b){return(a['created_time']>b['created_time'])?-1:1;}
break;}}
break;}
case'likes':{switch(sortOrder){case'asc':{operator=function(a,b){return(a['likes']['count']<b['likes']['count'])?-1:1;}
break;}
case'desc':{operator=function(a,b){return(a['likes']['count']<b['likes']['count'])?1:-1;}
break;}}
break;}
case'comments':{switch(sortOrder){case'asc':{operator=function(a,b){return(a['comments']['count']<b['comments']['count'])?-1:1;}
break;}
case'desc':{operator=function(a,b){return(a['comments']['count']<b['comments']['count'])?1:-1;}
break;}}
break;}
case'random':{operator=function(a,b){var num=Math.random();return(num>0.5)?1:-1;}
break;}}
return operator;}
wdi_front.feedSort=function(currentFeed,load_more_number){var sortImagesBy=currentFeed.feed_row['sort_images_by'];var sortOrder=currentFeed.feed_row['display_order'];if(currentFeed.feed_row['resort_after_load_more']==='1'){currentFeed['data']=currentFeed['data'].concat(wdi_front.smartPicker(currentFeed,load_more_number));}else{currentFeed['data']=wdi_front.smartPicker(currentFeed,load_more_number);}
var operator=wdi_front.sortingOperator(sortImagesBy,sortOrder);currentFeed['data'].sort(operator);return currentFeed['data'];}
wdi_front.smartPicker=function(currentFeed,load_more_number){var dataStorage=[];var dataLength=0;var readyData=[];var perUser=Math.ceil(currentFeed['feed_row']['number_of_photos']/currentFeed['usersData'].length);var number_of_photos=parseInt(currentFeed['feed_row']['number_of_photos']);var remainder=0;if(load_more_number!=''&&load_more_number!=undefined&&load_more_number!=null){number_of_photos=parseInt(load_more_number);perUser=Math.ceil(number_of_photos/wdi_front.activeUsersCount(currentFeed));}
var sortOperator=function(a,b){return(a['data'].length>b['data'].length)?1:-1;}
var sortOperator1=function(a,b){return(a.length()>b.length())?1:-1;}
currentFeed.storeRawData(currentFeed.usersData,'dataStorageRaw');var dataStorageRaw=currentFeed['dataStorageRaw'].sort(sortOperator1);var usersData=currentFeed['usersData'].sort(sortOperator);for(var i=0;i<usersData.length;i++){remainder+=perUser;if(dataStorageRaw[i].length()<=remainder){remainder-=dataStorageRaw[i].length();dataStorage.push(dataStorageRaw[i].getData(dataStorageRaw[i].length()));dataLength+=dataStorage[dataStorage.length- 1].length;}else{if(dataLength+ remainder>number_of_photos){remainder=number_of_photos- dataLength;}
var pickedData=[];if(currentFeed['auto_trigger']===false){pickedData=pickedData.concat(dataStorageRaw[i].getData(remainder));}else{if(pickedData.length+ wdi_front.getDataLength(currentFeed)+ wdi_front.getDataLength(currentFeed,dataStorage)<currentFeed['feed_row']['number_of_photos']){pickedData=pickedData.concat(dataStorageRaw[i].getData(remainder));}}
remainder=0;dataLength+=pickedData.length;dataStorage.push(pickedData);}}
for(i=0;i<dataStorage.length;i++){if(currentFeed.dataStorage[i]===undefined){currentFeed.dataStorage.push(dataStorage[i]);}else{currentFeed.dataStorage[i]=currentFeed.dataStorage[i].concat(dataStorage[i]);}}
currentFeed.parsedData=wdi_front.parseLighboxData(currentFeed);for(i=0;i<dataStorage.length;i++){readyData=readyData.concat(dataStorage[i]);}
return readyData;}
wdi_front.createObject=function(obj,currentFeed){var caption=(obj['caption']!=null)?obj['caption']['text']:'&nbsp';var image_url;if(window.innerWidth>=640){image_url=obj['images']['standard_resolution']['url'];if(currentFeed.feed_row.feed_type=='blog_style'||currentFeed.feed_row.feed_type=='image_browser'){image_url=obj['link']+'media?size=l';}}
if(window.innerWidth>=150&&window.innerWidth<640){image_url=obj['images']['low_resolution']['url'];if(currentFeed.feed_row.feed_type=='blog_style'||currentFeed.feed_row.feed_type=='image_browser'){image_url=obj['link']+'media?size=l';}}
if(window.innerWidth<150){image_url=obj['images']['thumbnail']['url'];if(currentFeed.feed_row.feed_type=='blog_style'||currentFeed.feed_row.feed_type=='image_browser'){image_url=obj['link']+'media?size=m';}}
var videoUrl='';if(obj['type']=='video'){videoUrl=obj['videos']['standard_resolution']['url'];}
var imageIndex=currentFeed.imageIndex;var photoObject={'id':obj['id'],'caption':caption,'image_url':image_url,'likes':obj['likes']['count'],'comments':obj['comments']['count'],'wdi_index':imageIndex,'wdi_res_index':currentFeed.resIndex,'link':obj['link'],'video_url':videoUrl,'wdi_username':obj['user']['username']};return photoObject;}
wdi_front.setPage=function(currentFeed){var display_type=currentFeed.feed_row.feed_display_view;var feed_type=currentFeed.feed_row.feed_type;if(display_type!='pagination'){return'';}
var imageIndex=currentFeed.imageIndex;if(feed_type=='image_browser'){var divider=1;}else{var divider=Math.abs(currentFeed.feed_row.pagination_per_page_number);}
currentFeed.paginator=Math.ceil((imageIndex+ 1)/ divider);
return currentFeed.paginator;}
wdi_front.getPhotoTemplate=function(currentFeed){var page=wdi_front.setPage(currentFeed);var customClass='';var pagination='';var onclick='';var overlayCustomClass='';var thumbClass='fa-fullscreen';var showUsernameOnThumb='';if(currentFeed.feed_row.feed_type=='blog_style'||currentFeed.feed_row.feed_type=='image_browser'){thumbClass='';}
if(page!=''){pagination='wdi_page="'+ page+'"';sourceAttr='src';}else{sourceAttr='src';}
if(page!=''&&page!=1){customClass='wdi_hidden';}
if(currentFeed.feed_row.show_username_on_thumb=='1'){showUsernameOnThumb='<span class="wdi_media_user">@<%= wdi_username%></span>';}
if(currentFeed.feed_row.show_full_description==1&&currentFeed.feed_row.feed_type=='masonry'){customClass+=' wdi_full_caption';}
var onclickevent="";if(currentFeed.feed_row.feed_type!=="blog_style"){if(currentFeed.feed_row.feed_type=='masonry'){onclickevent="wdi_responsive.showMasonryCaption(jQuery(this),"+currentFeed.feed_row.wdi_feed_counter+");"}else{onclickevent="wdi_responsive.showCaption(jQuery(this),"+currentFeed.feed_row.wdi_feed_counter+");";}}
switch(currentFeed.feed_row.feed_item_onclick){case'lightbox':{onclick="onclick=wdi_feed_"+ currentFeed.feed_row.wdi_feed_counter+".galleryBox('<%=id%>')";break;}
case'instagram':{onclick='onclick="window.open (\'<%= link%>\',\'_blank\')"';overlayCustomClass='wdi_hover_off';thumbClass='';break;}
case'none':{onclick='';overlayCustomClass='wdi_cursor_off wdi_hover_off';thumbClass='';}}
var wdi_feed_counter=currentFeed.feed_row['wdi_feed_counter'];var source='<div class="wdi_feed_item '+ customClass+'"  wdi_index=<%= wdi_index%>  wdi_res_index=<%= wdi_res_index%> '+ pagination+' wdi_type="image" id="wdi_'+ wdi_feed_counter+'_<%=id%>">'+'<div class="wdi_photo_wrap">'+'<div class="wdi_photo_wrap_inner">'+'<div class="wdi_photo_img">'+'<img class="wdi_img" '+sourceAttr+'="<%=image_url%>" alt="feed_image" onerror="wdi_front.brokenImageHandler(this);">'+'<div class="wdi_photo_overlay '+ overlayCustomClass+'" >'+ showUsernameOnThumb+'<div class="wdi_thumb_icon" '+ onclick+' style="display:table;width:100%;height:100%;">'+'<div style="display:table-cell;vertical-align:middle;text-align:center;color:white;">'+'<i class="fa '+ thumbClass+'"></i>'+'</div>'+'</div>'+'</div>'+'</div>'+'</div>'+'</div>';if(currentFeed['feed_row']['show_likes']==='1'||currentFeed['feed_row']['show_comments']==='1'||currentFeed['feed_row']['show_description']==='1'){source+='<div class="wdi_photo_meta">';if(currentFeed['feed_row']['show_likes']==='1'){source+='<div class="wdi_thumb_likes"><i class="fa fa-heart-o">&nbsp;<%= likes%></i></div>';}
if(currentFeed['feed_row']['show_comments']==='1'){source+='<div class="wdi_thumb_comments"><i class="fa fa-comment-o">&nbsp;<%= comments%></i></div>';}
source+='<div class="clear"></div>';if(currentFeed['feed_row']['show_description']==='1'){source+='<div class="wdi_photo_title" onclick='+ onclickevent+' >'+'<%=caption%>'+'</div>';}
source+='</div>';}
source+='</div>';var template=_.template(source);return template;}
wdi_front.replaceToVideo=function(url,index,feed_counter){overlayHtml="<video style='width:auto !important; height:auto !important; max-width:100% !important; max-height:100% !important; margin:0 !important;' controls=''>"+"<source src='"+ url+"' type='video/mp4'>"+"Your browser does not support the video tag. </video>";jQuery('#wdi_feed_'+ feed_counter+' [wdi_index="'+ index+'"] .wdi_photo_wrap_inner').html(overlayHtml);jQuery('#wdi_feed_'+ feed_counter+' [wdi_index="'+ index+'"] .wdi_photo_wrap_inner video').get(0).play();}
wdi_front.getVideoTemplate=function(currentFeed){var page=wdi_front.setPage(currentFeed);var customClass='';var pagination='';var thumbClass='fa-play';var onclick='';var overlayCustomClass='';var sourceAttr;var showUsernameOnThumb='';if(page!=''){pagination='wdi_page="'+ page+'"';sourceAttr='src';}else{sourceAttr='src';}
if(page!=''&&page!=1){customClass='wdi_hidden';}
if(currentFeed.feed_row.show_username_on_thumb=='1'){showUsernameOnThumb='<span class="wdi_media_user">@<%= wdi_username%></span>';}
if(currentFeed.feed_row.show_full_description==1&&currentFeed.feed_row.feed_type=='masonry'){customClass+=' wdi_full_caption';}
var onclickevent="";if(currentFeed.feed_row.feed_type!=="blog_style"){if(currentFeed.feed_row.feed_type=='masonry'){onclickevent="wdi_responsive.showMasonryCaption(jQuery(this),"+currentFeed.feed_row.wdi_feed_counter+");"}else{onclickevent="wdi_responsive.showCaption(jQuery(this),"+currentFeed.feed_row.wdi_feed_counter+");";}}
switch(currentFeed.feed_row.feed_item_onclick){case'lightbox':{onclick="onclick=wdi_feed_"+ currentFeed.feed_row.wdi_feed_counter+".galleryBox('<%=id%>')";break;}
case'instagram':{onclick='onclick="window.open (\'<%= link%>\',\'_blank\')"';overlayCustomClass='wdi_hover_off';thumbClass='fa-play';break;}
case'none':{overlayCustomClass='wdi_cursor_off wdi_hover_off';thumbClass='';if(currentFeed.feed_row.feed_type=='blog_style'||currentFeed.feed_row.feed_type=='image_browser'){onclick="onclick=wdi_front.replaceToVideo('<%= video_url%>','<%= wdi_index%>',"+ currentFeed.feed_row.wdi_feed_counter+")";overlayCustomClass='';thumbClass='fa-play';}}}
var wdi_feed_counter=currentFeed.feed_row['wdi_feed_counter'];var source='<div class="wdi_feed_item '+ customClass+'"  wdi_index=<%= wdi_index%> wdi_res_index=<%= wdi_res_index%> '+ pagination+' wdi_type="image" id="wdi_'+ wdi_feed_counter+'_<%=id%>">'+'<div class="wdi_photo_wrap">'+'<div class="wdi_photo_wrap_inner">'+'<div class="wdi_photo_img">'+'<img class="wdi_img" '+sourceAttr+'="<%=image_url%>" alt="feed_image" onerror="wdi_front.brokenImageHandler(this);">'+'<div class="wdi_photo_overlay '+ overlayCustomClass+'" '+ onclick+'>'+ showUsernameOnThumb+'<div class="wdi_thumb_icon" style="display:table;width:100%;height:100%;">'+'<div style="display:table-cell;vertical-align:middle;text-align:center;color:white;">'+'<i class="fa '+ thumbClass+'"></i>'+'</div>'+'</div>'+'</div>'+'</div>'+'</div>'+'</div>';if(currentFeed['feed_row']['show_likes']==='1'||currentFeed['feed_row']['show_comments']==='1'||currentFeed['feed_row']['show_description']==='1'){source+='<div class="wdi_photo_meta">';if(currentFeed['feed_row']['show_likes']==='1'){source+='<div class="wdi_thumb_likes"><i class="fa fa-heart-o">&nbsp;<%= likes%></i></div>';}
if(currentFeed['feed_row']['show_comments']==='1'){source+='<div class="wdi_thumb_comments"><i class="fa fa-comment-o">&nbsp;<%= comments%></i></div>';}
source+='<div class="clear"></div>';if(currentFeed['feed_row']['show_description']==='1'){source+='<div class="wdi_photo_title" onclick='+ onclickevent+' >'+'<%=caption%>'+'</div>';}
source+='</div>';}
source+='</div>';var template=_.template(source);return template;}
wdi_front.bindEvents=function(currentFeed){if(currentFeed.feed_row.feed_display_view=='load_more_btn'){jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' .wdi_load_more_container').on(wdi_front.clickOrTouch,function(){wdi_front.loadMore(jQuery(this).find('.wdi_load_more_wrap'));});}
if(currentFeed.feed_row.feed_display_view=='pagination'){jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' #wdi_next').on(wdi_front.clickOrTouch,function(){wdi_front.paginatorNext(jQuery(this),currentFeed);});jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' #wdi_prev').on(wdi_front.clickOrTouch,function(){wdi_front.paginatorPrev(jQuery(this),currentFeed);});jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' #wdi_last_page').on(wdi_front.clickOrTouch,function(){wdi_front.paginationLastPage(jQuery(this),currentFeed);});jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' #wdi_first_page').on(wdi_front.clickOrTouch,function(){wdi_front.paginationFirstPage(jQuery(this),currentFeed);});currentFeed.paginatorNextFlag=false;}
if(currentFeed.feed_row.feed_display_view=='infinite_scroll'){jQuery(window).on('scroll',function(){wdi_front.infiniteScroll(currentFeed);});currentFeed.infiniteScrollFlag=false;}}
wdi_front.infiniteScroll=function(currentFeed){if(jQuery(window).scrollTop()<=jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' #wdi_infinite_scroll').offset().top){if(currentFeed.infiniteScrollFlag===false&&currentFeed.stopInfiniteScrollFlag==false){currentFeed.infiniteScrollFlag=true;wdi_front.loadMore(jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' #wdi_infinite_scroll'),currentFeed);}else if(currentFeed.stopInfiniteScrollFlag){wdi_front.allImagesLoaded(currentFeed);}}}
wdi_front.paginationFirstPage=function(btn,currentFeed){if(currentFeed.paginator==1||currentFeed.currentPage==1){btn.addClass('wdi_disabled');return;}
var oldPage=currentFeed.currentPage;currentFeed.currentPage=1;wdi_front.updatePagination(currentFeed,'custom',oldPage);var last_page_btn=btn.parent().find('#wdi_last_page');last_page_btn.removeClass('wdi_disabled');btn.addClass('wdi_disabled');}
wdi_front.paginationLastPage=function(btn,currentFeed){if(currentFeed.paginator==1||currentFeed.currentPage==currentFeed.paginator){return;}
var oldPage=currentFeed.currentPage;currentFeed.currentPage=currentFeed.paginator;wdi_front.updatePagination(currentFeed,'custom',oldPage);btn.addClass('wdi_disabled');var first_page_btn=btn.parent().find('#wdi_first_page');first_page_btn.removeClass('wdi_disabled');}
wdi_front.paginatorNext=function(btn,currentFeed){var last_page_btn=btn.parent().find('#wdi_last_page');var first_page_btn=btn.parent().find('#wdi_first_page');currentFeed.paginatorNextFlag=true;if(currentFeed.paginator==currentFeed.currentPage&&!wdi_front.checkFeedFinished(currentFeed)){currentFeed.currentPage++;var number_of_photos=currentFeed.feed_row.number_of_photos;wdi_front.loadMore(btn,currentFeed,number_of_photos);last_page_btn.addClass('wdi_disabled');}else if(currentFeed.paginator>currentFeed.currentPage){currentFeed.currentPage++;wdi_front.updatePagination(currentFeed,'next');if(currentFeed.paginator>currentFeed.currentPage){last_page_btn.removeClass('wdi_disabled');}else{last_page_btn.addClass('wdi_disabled');}}
first_page_btn.removeClass('wdi_disabled');}
wdi_front.paginatorPrev=function(btn,currentFeed){var last_page_btn=btn.parent().find('#wdi_last_page');var first_page_btn=btn.parent().find('#wdi_first_page');if(currentFeed.currentPage==1){first_page_btn.addClass('wdi_disabled');return;}
currentFeed.currentPage--;wdi_front.updatePagination(currentFeed,'prev');last_page_btn.removeClass('wdi_disabled');if(currentFeed.currentPage==1){first_page_btn.addClass('wdi_disabled');}}
wdi_front.updatePagination=function(currentFeed,dir,oldPage){var currentFeedString='#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter'];jQuery(currentFeedString+' [wdi_page="'+ currentFeed.currentPage+'"]').each(function(){jQuery(this).removeClass('wdi_hidden');});switch(dir){case'next':{var oldPage=currentFeed.currentPage- 1;jQuery(currentFeedString+' .wdi_feed_wrapper').height(jQuery('.wdi_feed_wrapper').height());jQuery(currentFeedString+' [wdi_page="'+ oldPage+'"]').each(function(){jQuery(this).addClass('wdi_hidden');});break;}
case'prev':{var oldPage=currentFeed.currentPage+ 1;jQuery(currentFeedString+' .wdi_feed_wrapper').height(jQuery('.wdi_feed_wrapper').height());jQuery(currentFeedString+' [wdi_page="'+ oldPage+'"]').each(function(){jQuery(this).addClass('wdi_hidden');});break;}
case'custom':{var oldPage=oldPage;if(oldPage!=currentFeed.currentPage){jQuery(currentFeedString+' .wdi_feed_wrapper').height(jQuery('.wdi_feed_wrapper').height());jQuery(currentFeedString+' [wdi_page="'+ oldPage+'"]').each(function(){jQuery(this).addClass('wdi_hidden');});}
break;}}
currentFeed.paginatorNextFlag=false;jQuery(currentFeedString+' .wdi_feed_wrapper').css('height','auto');jQuery(currentFeedString+' #wdi_current_page').text(currentFeed.currentPage);}
wdi_front.loadMore=function(button,_currentFeed){var dataCounter=0;if(button!=''&&button!=undefined&&button!='initial'&&button!='initial-keep'){var currentFeed=window[button.parent().parent().parent().parent().attr('id')];}
if(_currentFeed!=undefined){var currentFeed=_currentFeed;}
var activeFilter=0,finishedFilter=0;for(var i=0;i<currentFeed.userSortFlags.length;i++){if(currentFeed.userSortFlags[i].flag===true){activeFilter++;for(var j=0;j<currentFeed.usersData.length;j++){if(currentFeed.userSortFlags[i]['id']===currentFeed.usersData[j]['user_id']){if(currentFeed.usersData[j]['finished']==='finished'){finishedFilter++;}}}}}
if(activeFilter===finishedFilter&&activeFilter!=0){return;}
if(button===''){currentFeed['auto_trigger']=true;}else{currentFeed['auto_trigger']=false;}
wdi_front.ajaxLoader(currentFeed);if(currentFeed.feed_row.feed_type==='masonry'&&currentFeed.feed_row.feed_display_view=='pagination'){jQuery('#wdi_feed_'+ wdi_front.feed_counter+' .wdi_full_caption').each(function(){jQuery(this).find('.wdi_photo_title').trigger(wdi_front.clickOrTouch);});}
for(var i=0;i<currentFeed.usersData.length;i++){if(currentFeed.usersData[i]['finished']==='finished'){dataCounter++;}}
if(dataCounter===currentFeed.usersData.length){wdi_front.allImagesLoaded(currentFeed);jQuery('#wdi_feed_'+ currentFeed['feed_row']['wdi_feed_counter']+' .wdi_load_more').remove();}
var usersData=currentFeed['usersData'];currentFeed.loadMoreDataCount=currentFeed.feed_users.length;for(var i=0;i<usersData.length;i++){var pagination=usersData[i]['pagination'];var user={user_id:usersData[i]['user_id'],username:usersData[i]['username']}
if(pagination['next_url']!=''&&pagination['next_url']!=null&&pagination['next_url']!=undefined){var next_url=pagination['next_url'];wdi_front.loadMoreRequest(user,next_url,currentFeed,button);}else{if(button=='initial-keep'){currentFeed.temproraryUsersData[i]=currentFeed.usersData[i];}
currentFeed.loadMoreDataCount--;wdi_front.checkForLoadMoreDone(currentFeed,button);continue;}}}
wdi_front.loadMoreRequest=function(user,next_url,currentFeed,button){var usersData=currentFeed['usersData'];var errorMessage='';currentFeed.instagram.requestByUrl(next_url,{success:function(response){if(response===''||response==undefined||response==null){errorMessage=wdi_front_messages.network_error;currentFeed.loadMoreDataCount--;alert(errorMessage);return;}
if(response['meta']['code']!=200){errorMessage=response['meta']['error_message'];currentFeed.loadMoreDataCount--;alert(errorMessage);return;}
response['user_id']=user.user_id;response['username']=user.username;for(var i=0;i<currentFeed['usersData'].length;i++){if(response['user_id']===currentFeed['usersData'][i]['user_id']){if(response['user_id'][0]==='#'){response['data']=wdi_front.appendRequestHashtag(response['data'],response['user_id']);}
if(button=='initial-keep'){currentFeed.temproraryUsersData[i]=currentFeed.usersData[i];}
currentFeed['usersData'][i]=response;currentFeed.loadMoreDataCount--;}}
wdi_front.checkForLoadMoreDone(currentFeed,button);}})}
wdi_front.checkForLoadMoreDone=function(currentFeed,button){var load_more_number=currentFeed.feed_row['load_more_number'];var number_of_photos=currentFeed.feed_row['number_of_photos'];if(currentFeed.loadMoreDataCount==0){currentFeed.temproraryUsersData=wdi_front.mergeData(currentFeed.temproraryUsersData,currentFeed.usersData);var gettedDataLength=wdi_front.getArrayContentLength(currentFeed.temproraryUsersData,'data');if(button=='initial-keep'){button='initial';}
if(button=='initial'){if(gettedDataLength<number_of_photos&&!wdi_front.userHasNoPhoto(currentFeed,currentFeed.temproraryUsersData)&&currentFeed.instagramRequestCounter<=currentFeed.maxConditionalFiltersRequestCount){wdi_front.loadMore('initial',currentFeed);}else{currentFeed.usersData=currentFeed.temproraryUsersData;wdi_front.displayFeed(currentFeed);wdi_front.applyFilters(currentFeed);currentFeed.temproraryUsersData=[];}}else{if(gettedDataLength<load_more_number&&!wdi_front.userHasNoPhoto(currentFeed,currentFeed.temproraryUsersData)&&currentFeed.instagramRequestCounter<=currentFeed.maxConditionalFiltersRequestCount){wdi_front.loadMore(undefined,currentFeed);}else{currentFeed.usersData=currentFeed.temproraryUsersData;if(!wdi_front.activeUsersCount(currentFeed)){return;};wdi_front.displayFeed(currentFeed,load_more_number);wdi_front.applyFilters(currentFeed);currentFeed.temproraryUsersData=[];}}}}
wdi_front.allDataHasFinished=function(currentFeed){var c=0;for(var j=0;j<currentFeed.dataStorageRaw.length;j++){if(currentFeed.dataStorageRaw[j].length()==0&&currentFeed.dataStorageRaw[j].locked==true){c++;}}
return(c==currentFeed.dataStorageRaw.length);}
wdi_front.mergeData=function(array1,array2){for(var i=0;i<array2.length;i++){if(array1[i]!=undefined){if(array2[i]['finished']=='finished'){continue;}
if(array1[i]['pagination']['next_max_id']==undefined){continue;}
array1[i]['data']=array1[i]['data'].concat(array2[i]['data']);array1[i]['pagination']=array2[i]['pagination'];array1[i]['user_id']=array2[i]['user_id'];array1[i]['username']=array2[i]['username'];array1[i]['meta']=array2[i]['meta'];}else{array1.push(array2[i]);}}
return array1;}
wdi_front.brokenImageHandler=function(source){source.src=wdi_url.plugin_url+"../images/missing.png";source.onerror="";return true;}
wdi_front.ajaxLoader=function(currentFeed){var wdi_feed_counter=currentFeed.feed_row['wdi_feed_counter'];var feed_container=jQuery('#wdi_feed_'+ wdi_feed_counter);if(currentFeed.feed_row.feed_display_view=='load_more_btn'){feed_container.find('.wdi_load_more').addClass('wdi_hidden');feed_container.find('.wdi_spinner').removeClass('wdi_hidden');}
if(currentFeed.feed_row.feed_display_view=='infinite_scroll'){var loadingDiv;if(feed_container.find('.wdi_ajax_loading').length==0){loadingDiv=jQuery('<div class="wdi_ajax_loading"><div><div><img class="wdi_load_more_spinner" src="'+ wdi_url.plugin_url+'../images/ajax_loader.png"></div></div></div>');feed_container.append(loadingDiv);}else{loadingDiv=feed_container.find('.wdi_ajax_loading');}
loadingDiv.removeClass('wdi_hidden');}}
wdi_front.allImagesLoaded=function(currentFeed){var wdi_feed_counter=currentFeed.feed_row['wdi_feed_counter'];var feed_container=jQuery('#wdi_feed_'+ wdi_feed_counter);if(currentFeed.feed_row.feed_display_view=='load_more_btn'){feed_container.find('.wdi_load_more').removeClass('wdi_hidden');feed_container.find('.wdi_spinner').addClass('wdi_hidden');}
if(currentFeed.feed_row.feed_display_view=='infinite_scroll'){jQuery('#wdi_feed_'+ currentFeed.feed_row['wdi_feed_counter']+' .wdi_ajax_loading').addClass('wdi_hidden');}
feed_container.trigger('wdi_feed_loaded');}
wdi_front.show=function(name,currentFeed){var wdi_feed_counter=currentFeed.feed_row['wdi_feed_counter'];var feed_container=jQuery('#wdi_feed_'+ wdi_feed_counter+' .wdi_feed_container');var _this=this;switch(name){case'header':{show_header();break;}
case'users':{show_users(currentFeed);break;}}
function show_header(){var templateData={'feed_thumb':currentFeed['feed_row']['feed_thumb'],'feed_name':currentFeed['feed_row']['feed_name'],};var headerTemplate=wdi_front.getHeaderTemplate(),html=headerTemplate(templateData),containerHtml=feed_container.find('.wdi_feed_header').html();feed_container.find('.wdi_feed_header').html(containerHtml+ html);}
function show_users(currentFeed){feed_container.find('.wdi_feed_users').html('');var users=currentFeed['feed_users'];var access_token=currentFeed['feed_row']['access_token'];var i=0;currentFeed.headerUserinfo=[];getThumb();function getThumb(){if(currentFeed.headerUserinfo.length==users.length){escapeRequest(currentFeed.headerUserinfo,currentFeed);return;}
var _user=users[currentFeed.headerUserinfo.length];switch(_this.getInputType(_user.username)){case'hashtag':{currentFeed.instagram.getTagRecentMedia(_this.stripHashtag(_user.username),{success:function(response){response=_this.checkMediaResponse(response);if(response!=false){if(response['data'].length==0){thumb_img='';}else{thumb_img=response['data'][0]['images']['thumbnail']['url'];}
var obj={name:users[i]['username'],url:thumb_img,};i++;currentFeed.headerUserinfo.push(obj);getThumb();}},args:{ignoreFiltering:true,}});break;}
case'user':{currentFeed.instagram.getUserInfo(_user.id,{success:function(response){response=_this.checkMediaResponse(response);if(response!=false){var obj={id:response['data']['id'],name:response['data']['username'],url:response['data']['profile_picture'],bio:response['data']['bio'],counts:response['data']['counts'],website:response['data']['website'],full_name:response['data']['full_name']}
currentFeed.headerUserinfo.push(obj);i++;getThumb();}},args:{ignoreFiltering:true,}})
break;}}}
function escapeRequest(info,currentFeed){feed_container.find('.wdi_feed_users').html('');for(var k=0;k<info.length;k++){var userFilter={'flag':false,'id':info[k]['id'],'name':info[k]['name']};var hashtagClass=(info[k]['name'][0]=='#')?'wdi_header_hashtag':'';var templateData={'user_index':k,'user_img_url':info[k]['url'],'counts':info[k]["counts"],'feed_counter':currentFeed.feed_row.wdi_feed_counter,'user_name':info[k]['name'],'bio':info[k]['bio'],'usersCount':currentFeed.feed_row.feed_users.length,'hashtagClass':hashtagClass};var userTemplate=wdi_front.getUserTemplate(currentFeed,info[k]['name']),html=userTemplate(templateData),containerHtml=feed_container.find('.wdi_feed_users').html();feed_container.find('.wdi_feed_users').html(containerHtml+ html);currentFeed.userSortFlags.push(userFilter);var clearFloat=jQuery('<div class="clear"></div>');}
feed_container.find('.wdi_feed_users').append(clearFloat);wdi_front.updateUsersImages(currentFeed);};}}
wdi_front.getUserTemplate=function(currentFeed,username){var usersCount=currentFeed.feed_row.feed_users.split(',').length,instagramLink,instagramLinkOnClick,js;switch(username[0]){case'#':{instagramLink='//instagram.com/explore/tags/'+ username.substr(1,username.length);break;}
default:{instagramLink='//instagram.com/'+ username;break;}}
js='window.open("'+ instagramLink+'","_blank")';instagramLinkOnClick="onclick='"+ js+"'";var source='<div class="wdi_single_user" user_index="<%=user_index%>">'+'<div class="wdi_header_user_text <%=hashtagClass%>">'+'<div class="wdi_user_img_wrap">'+'<img onerror="wdi_front.brokenImageHandler(this);" src="<%= user_img_url%>">';if(usersCount>1){source+='<div  title="'+ wdi_front_messages.filter_title+'" class="wdi_filter_overlay">'+'<div  class="wdi_filter_icon">'+'<span onclick="wdi_front.addFilter(<%=user_index%>,<%=feed_counter%>);" class="fa fa-filter"></span>'+'</div>'+'</div>';}
source+='</div>';source+='<h3 '+ instagramLinkOnClick+'><%= user_name%></h3>';if(username[0]!=='#'){if(currentFeed.feed_row.follow_on_instagram_btn=='1'){source+='<div class="wdi_user_controls">'+'<div class="wdi_follow_btn" onclick="window.open(\'//instagram.com/<%= user_name%>\',\'_blank\')"><span> Follow</span></div>'+'</div>';}
source+='<div class="wdi_media_info">'+'<p class="wdi_posts"><span class="fa fa-camera-retro"><%= counts.media%></span></p>'+'<p class="wdi_followers"><span class="fa fa-user"><%= counts.followed_by%></span></p>'+'</div>';}else{source+='<div class="wdi_user_controls">'+'</div>'+'<div class="wdi_media_info">'+'<p class="wdi_posts"><span></span></p>'+'<p class="wdi_followers"><span></span></p>'+'</div>';}
if(usersCount==1&&username[0]!=='#'&&currentFeed.feed_row.display_user_info=='1'){source+='<div class="wdi_bio"><%= bio%></div>';}
source+='</div>'+'</div>';var template=_.template(source);return template;}
wdi_front.getHeaderTemplate=function(){var source='<div class="wdi_header_wrapper">'+'<div class="wdi_header_img_wrap">'+'<img src="<%=feed_thumb%>">'+'</div>'+'<div class="wdi_header_text"><%=feed_name%></div>'+'<div class="clear">'+'</div>';var template=_.template(source);return template;}
wdi_front.addFilter=function(index,feed_counter){var currentFeed=window['wdi_feed_'+ feed_counter];var usersCount=currentFeed.feed_row.feed_users.split(',').length;if(usersCount<2){return;}
if(currentFeed.nowLoadingImages!=false){return;}else{var userDiv=jQuery('#wdi_feed_'+ currentFeed.feed_row.wdi_feed_counter+'_users [user_index="'+ index+'"]');userDiv.find('.wdi_filter_overlay').toggleClass('wdi_filter_active_bg');userDiv.find('.wdi_header_user_text h3').toggleClass('wdi_filter_active_col');userDiv.find('.wdi_media_info').toggleClass('wdi_filter_active_col');userDiv.find('.wdi_follow_btn').toggleClass('wdi_filter_active_col');currentFeed.customFilterChanged=true;if(currentFeed.userSortFlags[index]['flag']==false){currentFeed.userSortFlags[index]['flag']=true;}else{currentFeed.userSortFlags[index]['flag']=false;}
var activeFilterCount=0;for(var j=0;j<currentFeed.userSortFlags.length;j++){if(currentFeed.userSortFlags[j]['flag']==true){activeFilterCount++;}}
if(currentFeed.feed_row.feed_display_view=='pagination'){currentFeed.resIndex=0;}
if(activeFilterCount!=0){wdi_front.filterData(currentFeed);wdi_front.displayFeed(currentFeed);}else{currentFeed.customFilteredData=currentFeed.dataStorageList;wdi_front.displayFeed(currentFeed);}
if(currentFeed.feed_row.feed_display_view=='pagination'){currentFeed.paginator=Math.ceil((currentFeed.imageIndex)/ parseInt(currentFeed.feed_row.pagination_per_page_number));
currentFeed.currentPage=currentFeed.paginator;wdi_front.updatePagination(currentFeed,'custom',1);jQuery('#wdi_first_page').removeClass('wdi_disabled');jQuery('#wdi_last_page').addClass('wdi_disabled');}}}
wdi_front.filterData=function(currentFeed){var users=currentFeed.userSortFlags;currentFeed.customFilteredData=[];for(var i=0;i<currentFeed.dataStorageList.length;i++){for(var j=0;j<users.length;j++){if((currentFeed.dataStorageList[i]['user']['id']==users[j]['id']||currentFeed.dataStorageList[i]['wdi_hashtag']==users[j]['name'])&&users[j]['flag']==true){currentFeed.customFilteredData.push(currentFeed.dataStorageList[i]);}}}}
wdi_front.applyFilters=function(currentFeed){for(var i=0;i<currentFeed.userSortFlags.length;i++){if(currentFeed.userSortFlags[i]['flag']==true){var userDiv=jQuery('#wdi_feed_'+ currentFeed.feed_row.wdi_feed_counter+'[user_index="'+ i+'"]');wdi_front.addFilter(i,currentFeed.feed_row.wdi_feed_counter);wdi_front.addFilter(i,currentFeed.feed_row.wdi_feed_counter);}}}
wdi_front.getImgCount=function(currentFeed){var dataStorage=currentFeed.dataStorage;var count=0;for(var i=0;i<dataStorage.length;i++){count+=dataStorage[i].length;}
return count;}
wdi_front.parseLighboxData=function(currentFeed,filterFlag){var dataStorage=currentFeed.dataStorage;var sortImagesBy=currentFeed.feed_row['sort_images_by'];var sortOrder=currentFeed.feed_row['display_order'];var sortOperator=wdi_front.sortingOperator(sortImagesBy,sortOrder);var data=[];var popupData=[];var obj={};if(filterFlag==true){data=currentFeed.customFilteredData;}else{for(var i=0;i<dataStorage.length;i++){for(var j=0;j<dataStorage[i].length;j++){data.push(dataStorage[i][j]);}}
data.sort(sortOperator);}
for(i=0;i<data.length;i++){obj={'alt':'','avg_rating':'','comment_count':data[i]['comments']['count'],'date':wdi_front.convertUnixDate(data[i]['created_time']),'description':wdi_front.getDescription((data[i]['caption']!==null)?data[i]['caption']['text']:''),'filename':wdi_front.getFileName(data[i]),'filetype':wdi_front.getFileType(data[i]['type']),'hit_count':'0','id':data[i]['id'],'image_url':data[i]['link'],'number':0,'rate':'','rate_count':'0','username':data[i]['user']['username'],'profile_picture':data[i]['user']['profile_picture'],'thumb_url':data[i]['link']+'media/?size=t','comments_data':data[i]['comments']['data']}
popupData.push(obj);}
return popupData;}
wdi_front.convertUnixDate=function(date){var utcSeconds=parseInt(date);var newDate=new Date(0);newDate.setUTCSeconds(utcSeconds);var str=newDate.getFullYear()+'-'+ newDate.getMonth()+'-'+ newDate.getDate();str+=' '+ newDate.getHours()+':'+ newDate.getMinutes();return str;}
wdi_front.getDescription=function(desc){desc=desc.replace(/\r?\n|\r/g,' ');return desc;}
wdi_front.getFileName=function(data){var link=data['link'];var type=data['type'];if(type==='image'){var linkFragments=link.split('/');return linkFragments[linkFragments.length- 2];}else{return data['videos']['standard_resolution']['url'];}}
wdi_front.getFileType=function(type){if(type==='image'){return"EMBED_OEMBED_INSTAGRAM_IMAGE";}
if(type==='video'){return"EMBED_OEMBED_INSTAGRAM_VIDEO";}}
wdi_front.array_max=function(array){var max=array[0];var minIndex=0;for(var i=1;i<array.length;i++){if(max<array[i]){max=array[i];minIndex=i;}}
return{'value':max,'index':minIndex};}
wdi_front.array_min=function(array){var min=array[0];var minIndex=0;for(var i=1;i<array.length;i++){if(min>array[i]){min=array[i];minIndex=i;}}
return{'value':min,'index':minIndex};}
wdi_front.activeUsersCount=function(currentFeed){var counter=0;for(var i=0;i<currentFeed.usersData.length;i++){if(currentFeed.usersData[i].finished!='finished'){counter++;}}
return counter;}
wdi_front.checkMediaResponse=function(response){if(response==''||response==undefined||response==null){errorMessage=wdi_front_messages.connection_error;alert(errorMessage);return false;}
if(response['meta']['code']!=200){errorMessage=response['meta']['error_message'];alert(errorMessage);return false;}
return response;}
wdi_front.stripHashtag=function(hashtag){switch(hashtag[0]){case'#':{return hashtag.substr(1,hashtag.length);break;}
default:{return hashtag;break;}}}
wdi_front.getInputType=function(input){switch(input[0]){case'#':{return'hashtag';break;}
case'%':{return'location';break;}
default:{return'user';break;}}}
wdi_front.regexpTestCaption=function(captionText,searchkey){var flag1=false,flag2=false,matchIndexes=[],escKey=searchkey.replace(/[-[\]{}()*+?.,\\^$|]/g,"\\$&"),regexp1=new RegExp("(?:^|\\s)"+escKey+"(?:^|\\s)"),regexp2=new RegExp("(?:^|\\s)"+escKey,'g');if(regexp1.exec(captionText)!=null){flag1=true;}
while((match=regexp2.exec(captionText))!=null){if(match.index==captionText.length- searchkey.length- 1){flag2=true;}}
if(flag1==true||flag2==true){return true;}else{return false;}}
wdi_front.replaceNewLines=function(string){var delimeter="vUkCJvN2ps3t",matchIndexes=[],regexp;string=string.replace(/\r?\n|\r/g,delimeter);regexp=new RegExp(delimeter,'g');while((match=regexp.exec(string))!=null){matchIndexes.push(match.index);}
var pieces=string.split(delimeter);var foundFlag=0;for(var i=0;i<pieces.length;i++){if(pieces[i]==''){foundFlag++;}else{foundFlag=0;}
if(foundFlag>0){pieces.splice(i,1);foundFlag--;i--;}}
string=pieces.join(' ');return string;}
wdi_front.isEmptyObject=function(obj){for(var prop in obj){if(obj.hasOwnProperty(prop))
return false;}
return true}
var WDIFeed=function(obj){this['data']=obj['data']
this['dataCount']=obj['dataCount']
this['feed_row']=obj['feed_row']
this['usersData']=obj['usersData']};WDIFeed.prototype.conditionalFilter=function(response,args){var currentFeed=this,conditional_filter_type=currentFeed.feed_row.conditional_filter_type,filters=currentFeed.feed_row.conditional_filters;if(args.ignoreFiltering==true){}else{response=this.avoidDuplicateMedia(response);}
if(!wdi_front.isJsonString(filters)){return response;}else{filters=JSON.parse(filters);if(filters.length==0){return response;}}
if(currentFeed.feed_row.conditional_filter_enable=='0'){return response;}
currentFeed.instagramRequestCounter++;switch(conditional_filter_type){case'AND':{response=this.applyANDLogic(response,filters,currentFeed);break;}
case'OR':{response=this.applyORLogic(response,filters,currentFeed)
break;}
case'NOR':{response=this.applyNORLogic(response,filters,currentFeed)
break;}
default:{break;}}
return response;}
WDIFeed.prototype.applyANDLogic=function(response,filters){var currentFeed=this;for(var i=0;i<filters.length;i++){response=this.filterResponse(response,filters[i]);}
return response;}
WDIFeed.prototype.applyORLogic=function(response,filters){var currentFeed=this;var allData=[],res,mergedData=[],returnObject,media;for(var i=0;i<filters.length;i++){res=this.filterResponse(response,filters[i]);allData=allData.concat(res['data']);res={};}
for(i=0;i<allData.length;i++){media=allData[i];if(!this.mediaExists(media,mergedData)&&!this.mediaExists(media,currentFeed.dataStorageList)){mergedData.push(media);}}
returnObject={data:mergedData,meta:response['meta'],pagination:response['pagination']}
return returnObject;}
WDIFeed.prototype.applyNORLogic=function(response,filters){var res=response,currentFeed=this,matchedData=this.applyORLogic(response,filters,currentFeed),mergedData=[],returnObject;for(var i=0;i<res['data'].length;i++){if(!this.mediaExists(res['data'][i],matchedData['data'])){mergedData.push(res['data'][i]);}}
returnObject={data:mergedData,meta:res['meta'],pagination:res['pagination']}
return returnObject;}
WDIFeed.prototype.mediaExists=function(media,array){for(var i=0;i<array.length;i++){if(media['id']==array[i]['id']){return true;}}
return false;}
WDIFeed.prototype.filterResponse=function(response,filter){switch(filter.filter_type){case'hashtag':{return this.filterByHashtag(response,filter);break;}
case'username':{return this.filterByUsername(response,filter);break;}
case'mention':{return this.filterByMention(response,filter);break;}
case'description':{return this.filterByDescription(response,filter);break;}
case'location':{return this.filterByLocation(response,filter);break;}
case'url':{return this.filterByUrl(response,filter);break;}}}
WDIFeed.prototype.filterByHashtag=function(response,filter){var filteredResponse=[],currentTag,media,returnObject;for(var i=0;i<response['data'].length;i++){media=response['data'][i];for(var j=0;j<media['tags'].length;j++){tag=media['tags'][j];if(tag.toLowerCase()==filter.filter_by.toLowerCase()){filteredResponse.push(media);}}}
returnObject={data:filteredResponse,meta:response['meta'],pagination:response['pagination']}
return returnObject;}
WDIFeed.prototype.filterByUsername=function(response,filter){var filteredResponse=[],media,returnObject;for(var i=0;i<response['data'].length;i++){media=response['data'][i];if(media.user.username.toLowerCase()==filter.filter_by.toLowerCase()){filteredResponse.push(media);}}
returnObject={data:filteredResponse,meta:response['meta'],pagination:response['pagination']}
return returnObject;}
WDIFeed.prototype.filterByMention=function(response,filter){var filteredResponse=[],media,captionText,returnObject;for(var i=0;i<response['data'].length;i++){media=response['data'][i];if(media['caption']!==null){captionText=media['caption']['text'].toLowerCase();if(captionText.indexOf('@'+ filter.filter_by.toLowerCase())!=-1){filteredResponse.push(media);}}}
returnObject={data:filteredResponse,meta:response['meta'],pagination:response['pagination']}
return returnObject;}
WDIFeed.prototype.filterByDescription=function(response,filter){var filteredResponse=[],media,captionText,returnObject;for(var i=0;i<response['data'].length;i++){media=response['data'][i];if(media['caption']!==null){captionText=media['caption']['text'].toLowerCase();captionText=wdi_front.replaceNewLines(captionText);var searchkey=filter.filter_by.toLowerCase();if(wdi_front.regexpTestCaption(captionText,searchkey)){filteredResponse.push(media);}}}
returnObject={data:filteredResponse,meta:response['meta'],pagination:response['pagination']}
return returnObject;}
WDIFeed.prototype.filterByLocation=function(response,filter){var filteredResponse=[],media,locationId,returnObject;for(var i=0;i<response['data'].length;i++){media=response['data'][i];if(media['location']!==null){locationId=media['location']['id'];if(locationId==filter.filter_by){filteredResponse.push(media);}}}
returnObject={data:filteredResponse,meta:response['meta'],pagination:response['pagination']}
return returnObject;}
WDIFeed.prototype.filterByUrl=function(response,filter){var filteredResponse=[],media,id,returnObject,filter_by;filter.filter_by=this.getIdFromUrl(filter.filter_by);for(var i=0;i<response['data'].length;i++){media=response['data'][i];if(media['link']!==null){id=this.getIdFromUrl(media['link']);if(id==filter.filter_by){filteredResponse.push(media);}}}
returnObject={data:filteredResponse,meta:response['meta'],pagination:response['pagination']}
return returnObject;}
WDIFeed.prototype.getIdFromUrl=function(url){var url_parts=url.split('/'),id=false;for(var i=0;i<url_parts.length;i++){if(url_parts[i]=='p'){if(typeof url_parts[i+ 1]!='undefined'){id=url_parts[i+ 1];break;}}};return id;}
WDIFeed.prototype.avoidDuplicateMedia=function(response){var data=response['data'],uniqueData=[],returnObject={};for(var i=0;i<data.length;i++){if(!this.mediaExists(data[i],this.dataStorageList)&&!this.mediaExists(data[i],uniqueData)&&!this.mediaExists(data[i],this.conditionalFilterBuffer)){uniqueData.push(data[i]);}}
this.conditionalFilterBuffer=this.conditionalFilterBuffer.concat(uniqueData);returnObject={data:uniqueData,meta:response['meta'],pagination:response['pagination']}
return returnObject;}
WDIFeed.prototype.storeRawData=function(objects,variable){var _this=this;if(typeof this[variable]=="object"&&typeof this[variable].length=="number"){for(var i=0;i<objects.length;i++){var hash_id="";if(wdi_front.isHashtag(objects[i].user_id)){hash_id=objects[i].pagination.next_max_tag_id;}else{hash_id=objects[i].pagination.next_max_id;if(typeof hash_id=="undefined"){hash_id="";}}
if(typeof this[variable][i]=="undefined"){this[variable].push({data:objects[i].data,index:0,locked:false,hash_id:hash_id,usersDataFinished:false,userId:objects[i].user_id,length:function(){return this.data.length- this.index;},getData:function(num){var data=this.data.slice(this.index,this.index+num);this.index+=Math.min(num,this.length());if(this.index==this.data.length&&this.locked==true&&this.usersDataFinished==false){for(var j=0;j<_this.usersData.length;j++){if(_this.usersData[j]['user_id']==this.userId){_this.usersData[j].finished="finished";this.usersDataFinished=true;break;}}}
return data;}});}else{if(this[variable][i].locked==false){if(hash_id!=this[variable][i].hash_id){this[variable][i].data=this[variable][i].data.concat(objects[i].data);this[variable][i].hash_id=hash_id;}else{this[variable][i].locked=true;}}}}}}
wdi_front.updateUsersIfNecessary=function(currentFeed){var users=currentFeed.feed_users;var ifUpdateNecessary=false;for(var i=0;i<users.length;i++){if("#"==users[i].username.substr(0,1)){users[i].id=users[i].username;continue;}
if(""==users[i].id||'username'==users[i].id){ifUpdateNecessary=true;currentFeed.instagram.searchForUsersByName(users[i].username,{success:function(res){if(res.meta.code==200&&res.data.length>0){var found=false;for(var k=0;k<res.data.length;k++){if(res.data[k].username==res.args.username){found=true;break;}}
if(found){for(var j=0;j<users.length;j++){if(res.data[k].username==users[j].username){users[j].id=res.data[k].id;}}}}
var noid_user_left=false;for(var m=0;m<users.length;m++){if(users[m].id==""||users[m].id=="username"){noid_user_left=true;break;}}
if(!noid_user_left){currentFeed.feed_row.feed_users=JSON.stringify(users);wdi_front.init(currentFeed);}},username:users[i].username});}}
return ifUpdateNecessary;}