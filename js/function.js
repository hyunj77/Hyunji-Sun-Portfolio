$(function(){
  $(window).on('load',function(){
    new WOW().init();
  });
});//wow plugin 초기화

$(function(){
  //커스텀 마우스 커서 — 터치 기기는 건드리지 않고 그대로 둠
  var isMouseDevice = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(isMouseDevice){
    var $html = $('html');
    var $cursor = $('#customCursor');
    $html.addClass('has-custom-cursor');

    $(window).on('mousemove',function(event){
      $cursor.css({left:event.clientX+'px', top:event.clientY+'px'});
    });

    $(document).on('mouseenter','a, button, .project-card, .gallOpen', function(){
      if($(this).hasClass('project-card')){
        $cursor.addClass('cursor-view').removeClass('cursor-grow');
      }else{
        $cursor.addClass('cursor-grow');
      }
    });
    $(document).on('mouseleave','a, button, .project-card, .gallOpen', function(){
      $cursor.removeClass('cursor-grow cursor-view');
    });
  }
  //end of 커스텀 커서

  //var
  var $header = $('header');
  var $mnu = $('header>.container>nav>.gnb>li>a');
  var $tag = $('#aboutme>.content1-right>.tag>ul>li>a');
  var $toTop = $('#toTop');
  var $scrollProgress = $('#scrollProgress');
  var scrollTop = 0;
  var nowIdx = 0;
  var arrTopVal = [];

  $('section').each(function(idx){
    arrTopVal[idx] = $(this).offset().top;
  });

  //header
  $mnu.on('click',function(event){
    event.preventDefault();
    nowIdx = $mnu.index(this);

    $mnu.eq(nowIdx).parent().addClass('on').siblings().removeClass('on');
    $('html,body').stop().animate({
      scrollTop : arrTopVal[nowIdx]
    },500,'easeInOutCubic');
  });

  $(window).on('scroll',function(){
    scrollTop = $(this).scrollTop();

    if(scrollTop>arrTopVal[0]){
      $header.addClass('active');
    }else{
      $header.removeClass('active');
    }

    if(scrollTop>arrTopVal[0]){
      $toTop.addClass('show');
    }else{
      $toTop.removeClass('show');
    }

    for(var i=0; i<arrTopVal.length; i++){
      if(scrollTop>=arrTopVal[i]){
        $mnu.eq(i).parent().addClass('on').siblings().removeClass('on');
      }
    }

    //스크롤 진행바
    var docHeight = $(document).height() - $(window).height();
    var progress = docHeight>0 ? (scrollTop/docHeight)*100 : 0;
    $scrollProgress.css('width', progress+'%');
  });//end of header event

  //tag — 장식용 키워드라 클릭해도 페이지 이동은 하지 않음
  $tag.on('click',function(event){
    event.preventDefault();
  });

  //맨 위로 이동 버튼
  $toTop.on('click',function(){
    $('html,body').stop().animate({scrollTop:0},500,'easeInOutCubic');
  });

});//end of header handler

$(function(){
  //var
  var $mePrev = $('#aboutme>.content1-right>.profile>.prev');
  var $meNext = $('#aboutme>.content1-right>.profile>.next');
  var $aboutme = $('#aboutme>.content1-right>.profile>ul>li');
  var meLast = $aboutme.length - 1;

  var $viewOpen = $('.viewOpen');
  var $viewClose = $('.viewClose');
  var $view = $('#portfolio>.portfolio_bg');
  var $viewTitle = $('#portfolio>.portfolio_bg>.portfolio_img>.view-detail-title');

  var $dePrev = $('#design>.prev');
  var $deNext = $('#design>.next');
  var $design = $('#design>.container>ul');
  var $designs = $('#design>.container>ul>li');
  var deLast = $designs.length - 1;
  var $gallOpen = $('.gallOpen');
  var $gallClose = $('.gallClose');
  var $gall = $('#design>.gallery_bg');

  var meIdx = 0;
  var deIdx = 0;

  //skills 필터 버튼
  var $skillFilter = $('#skills>.tool-filter>li>a');
  var $skillItem = $('#skills>.tool>li');

  $skillFilter.on('click',function(event){
    event.preventDefault();
    var filter = $(this).data('filter');

    $skillFilter.removeClass('on');
    $(this).addClass('on');

    if(filter==='all'){
      $skillItem.removeClass('hide');
    }else{
      $skillItem.each(function(){
        $(this).toggleClass('hide', $(this).data('category')!==filter);
      });
    }
  });
  //end of skills 필터

  //about me — 이전/다음으로 페이지 전환
  $mePrev.on('click',function(){
    if(meIdx>0){
      meIdx--;
      $mePrev.addClass('on');
    }else{
      $mePrev.removeClass('on');
    }
    if(meIdx<meLast){ $meNext.removeClass('on'); }

    $aboutme.eq(meIdx).show().siblings().hide();
  });

  $meNext.on('click',function(){
    if(meIdx<meLast){
      meIdx++;
      $meNext.addClass('on');
    }else{
      $meNext.removeClass('on');
    }
    if(meIdx>0){ $mePrev.removeClass('on'); }

    $aboutme.eq(meIdx).show().siblings().hide();
  });
  //end of about me

  // 실제 프로젝트 이미지/내용이 아직 없어서 카드 제목만 채우고 안내 표시
  $viewOpen.on('click',function(event){
    event.preventDefault();
    $viewTitle.text($(this).data('title'));
    $view.fadeIn();
  });

  $viewClose.on('click',function(event){
    event.preventDefault();
    $view.fadeOut();
  });

  $view.on('click',function(event){
    if(event.target === this){ $view.fadeOut(); }
  });

  //프로젝트 카드 마우스 틸트 효과
  $('#portfolio>.container>.project-grid>.project-card').on('mousemove',function(event){
    var $mockup = $(this).find('.project-mockup');
    var rect = this.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var midX = rect.width/2;
    var midY = rect.height/2;
    var rotateY = ((x-midX)/midX)*8;
    var rotateX = -((y-midY)/midY)*8;

    $mockup.css({
      'transition':'none',
      'transform':'translateY(-6px) scale(1.03) rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)'
    });
  }).on('mouseleave',function(){
    $(this).find('.project-mockup').css({
      'transition':'transform 0.4s ease',
      'transform':'none'
    });
  });
  //end of portfolio

  //design
  function galleryMove(){
    $designs.eq(deIdx).addClass('on').siblings().removeClass('on');
  }

  $dePrev.on('click',function(){
    if(deIdx>0){
      deIdx--;
      $dePrev.addClass('on');
    }else{
      $dePrev.removeClass('on');
    }
    if(deIdx<deLast){ $deNext.removeClass('on'); }

    galleryMove();
  });

  $deNext.on('click',function(){
    if(deIdx<deLast){
      deIdx++;
      $deNext.addClass('on');
    }else{
      $deNext.removeClass('on');
    }
    if(deIdx>0){ $dePrev.removeClass('on'); }

    galleryMove();
  });

  // 실제 디자인 이미지가 아직 없어서 안내만 표시
  $gallOpen.on('click',function(event){
    event.preventDefault();
    $gall.fadeIn();
  });

  $gallClose.on('click',function(event){
    event.preventDefault();
    $gall.fadeOut();
  });

  $gall.on('click',function(event){
    if(event.target === this){ $gall.fadeOut(); }
  });//end of design
});//end of section handler
