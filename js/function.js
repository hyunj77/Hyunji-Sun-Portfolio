$(function(){
  $(window).on('load',function(){
    new WOW().init();
  });
});//wow plugin 초기화

$(function(){
  //이미지 우클릭(다른 이름으로 저장/새 탭에서 열기 등) 방지 — 배경 이미지 요소도 함께 차단
  //단, 개발자도구·화면 캡처까지 막을 수는 없는 캐주얼한 방지용
  document.addEventListener('contextmenu', function(event){
    var el = event.target;
    var hasBgImage = window.getComputedStyle(el).backgroundImage !== 'none';
    if(el.tagName === 'IMG' || hasBgImage){
      event.preventDefault();
    }
  });
  document.addEventListener('dragstart', function(event){
    if(event.target.tagName === 'IMG'){ event.preventDefault(); }
  });
});//end of image protect

$(function(){
  //Contact 섹션 등장 효과 — WOW.js는 빠른 스크롤 시 트리거를 놓쳐 영구히 안 보이는 버그가 있어서
  //IntersectionObserver로 안전하게 처리 (시각적으로는 다른 섹션과 동일한 fadeInUp 느낌)
  var revealTargets = document.querySelectorAll('#contact .scroll-reveal');
  if(revealTargets.length){
    if('IntersectionObserver' in window){
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },{threshold:0.15});
      revealTargets.forEach(function(el){ observer.observe(el); });
    }else{
      revealTargets.forEach(function(el){ el.classList.add('in'); });
    }
  }
});//end of contact reveal

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

    $(document).on('mouseenter','a, button, .project-card, .gallOpen, .scroll-indicator', function(){
      if($(this).hasClass('project-card') || $(this).hasClass('gallOpen')){
        $cursor.addClass('cursor-view').removeClass('cursor-grow');
      }else{
        $cursor.addClass('cursor-grow');
      }
    });
    $(document).on('mouseleave','a, button, .project-card, .gallOpen, .scroll-indicator', function(){
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

  function recalcSectionOffsets(){
    $('section').each(function(idx){
      arrTopVal[idx] = $(this).offset().top;
    });
  }
  recalcSectionOffsets();
  $(window).on('load',function(){ recalcSectionOffsets(); });
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){ recalcSectionOffsets(); });
  }

  //header
  $mnu.on('click',function(event){
    event.preventDefault();
    nowIdx = $mnu.index(this);

    $mnu.eq(nowIdx).parent().addClass('on').siblings().removeClass('on');
    $('html,body').stop().animate({
      scrollTop : arrTopVal[nowIdx]
    },500,'easeInOutCubic');

    $header.removeClass('nav-open');
    $('.mobile-menu-toggle').attr('aria-expanded','false');
  });

  //모바일 햄버거 메뉴 토글
  $('.mobile-menu-toggle').on('click',function(){
    var isOpen = $header.toggleClass('nav-open').hasClass('nav-open');
    $(this).attr('aria-expanded', isOpen ? 'true' : 'false');
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

    //페이지 맨 아래에 도달하면 offset 오차와 상관없이 마지막 메뉴(Contact) 강제 활성화
    if(scrollTop + $(window).height() >= $(document).height() - 5){
      $mnu.eq(arrTopVal.length-1).parent().addClass('on').siblings().removeClass('on');
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

  //Hero 하단 스크롤 다운 인디케이터 — 클릭하면 다음 섹션(About me)으로 이동
  $('#home>.scroll-indicator').on('click',function(){
    $('html,body').stop().animate({scrollTop:arrTopVal[1]},500,'easeInOutCubic');
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
  var $viewDesc = $('#portfolio>.portfolio_bg>.portfolio_img>.view-detail-desc');
  var $viewNotice = $('#portfolio>.portfolio_bg>.portfolio_img>.notice-text');

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
  //클릭 시 항목을 다시 나타나게 트리거 (숨겨진 상태에서는 스크롤 감지 효과가 안 먹어서 직접 재생)
  function replayReveal($page){
    var $blocks = $page.find('.js-reveal');
    $blocks.removeClass('in');
    void $blocks.get(0) && $blocks.get(0).offsetHeight;
    $blocks.addClass('in');
  }

  //첫 페이지(전공/수료)는 로드 시 한 번 재생
  setTimeout(function(){ replayReveal($aboutme.eq(0)); }, 300);

  $mePrev.on('click',function(){
    if(meIdx>0){
      meIdx--;
      $mePrev.addClass('on');
    }else{
      $mePrev.removeClass('on');
    }
    if(meIdx<meLast){ $meNext.removeClass('on'); }

    $aboutme.eq(meIdx).show().siblings().hide();
    replayReveal($aboutme.eq(meIdx));
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
    replayReveal($aboutme.eq(meIdx));
  });
  //end of about me

  // 프로젝트 상세 설명이 준비된 카드는 설명을 보여주고, 아직인 카드는 "준비중" 안내만 표시
  $viewOpen.on('click',function(event){
    event.preventDefault();
    var desc = $(this).data('desc');
    $viewTitle.text($(this).data('title'));
    if(desc){
      $viewDesc.text(desc).show();
      $viewNotice.hide();
    }else{
      $viewDesc.hide();
      $viewNotice.show();
    }
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

  //Design 갤러리는 990px 고정 그리드라, 모바일에서는 화면 폭에 맞는 비율로 축소해서
  //화면 끝까지 꽉 차게 만듦 (고정 scale 값 하나로는 기기마다 폭이 달라 안 맞았음)
  var GALLERY_WIDTH = 990;
  var GALLERY_HEIGHT = 530;

  function fitDesignGallery(){
    var $designSection = $('#design');
    var $designContainer = $('#design>.container');
    var $designH2 = $('#design>h2');
    var $designBtns = $('#design>.prev, #design>.next');

    if(window.matchMedia('(max-width:768px)').matches){
      var sectionWidth = $designSection.width();
      var scale = sectionWidth / GALLERY_WIDTH;
      var scaledHeight = GALLERY_HEIGHT * scale;
      var containerTop = $designH2.position().top + $designH2.outerHeight(true) + 20;

      $designContainer.css({top:containerTop, transform:'scale('+scale+')'});
      $designBtns.css('top', containerTop + scaledHeight/2);
      $designSection.css('height', containerTop + scaledHeight + 40);
    }else{
      $designContainer.css({top:'', transform:''});
      $designBtns.css('top','');
      $designSection.css('height','');
    }
  }

  fitDesignGallery();
  $(window).on('load resize orientationchange', fitDesignGallery);
});//end of section handler
