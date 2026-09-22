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
  var $view = $('.portfolio_bg');
  var $viewImg = $('.portfolio_bg>.portfolio_img');
  var $viewTitle = $viewImg.find('.view-detail-title');
  var $viewDesc = $viewImg.find('.view-detail-desc');
  var $viewNotice = $viewImg.find('.notice-text');
  var $viewLink = $viewImg.find('.view-detail-link');
  var $viewOriginalLink = $viewImg.find('.view-detail-original-link');
  var $viewTags = $viewImg.find('.view-detail-tags');
  var $viewPreview = $viewImg.find('.view-preview');
  var $viewPreviewFrame = $viewImg.find('.view-preview-frame');

  // 미리보기 위에서 휠을 굴리면 카드 자체가 아니라, 그 안의 실제 사이트가
  // 스크롤되도록 한다 — iframe이 축소 표시 중이라 델타값을 배율만큼 보정.
  // 같은 출처(로컬 페이지 등)면 직접 스크롤하고, 다른 도메인이면 postMessage로
  // 스크롤 요청을 보낸다 (Green Thumb처럼 이 메시지를 받아 처리하도록 되어
  // 있는 사이트만 반응하고, 그 외에는 조용히 무시된다).
  $viewPreview.on('wheel', function(event){
    var deltaY = event.originalEvent.deltaY;
    var scale = $viewPreviewFrame.data('scale') || 1;
    var frameWin = $viewPreviewFrame[0].contentWindow;
    var scrollAmount = deltaY / scale;
    try{
      // behavior:'instant'로 강제 — 대상 사이트에 scroll-behavior:smooth가
      // 걸려 있으면 빠른 휠 이벤트마다 애니메이션이 다시 시작되면서
      // 스크롤이 느리고 뚝뚝 끊기는 느낌이 난다.
      frameWin.scrollBy({ top: scrollAmount, left: 0, behavior: 'instant' });
    }catch(e){
      frameWin.postMessage({ type: 'portfolio-preview-scroll', deltaY: scrollAmount }, '*');
    }
    event.preventDefault();
  });
  var $viewMeta = $viewImg.find('.view-detail-meta');
  var $viewRoleRow = $viewImg.find('.view-detail-role-row');
  var $viewRole = $viewImg.find('.view-detail-role');
  var $viewPeriodRow = $viewImg.find('.view-detail-period-row');
  var $viewPeriod = $viewImg.find('.view-detail-period');
  var $viewTechStackRow = $viewImg.find('.view-detail-techstack-row');
  var $viewTechStackText = $viewImg.find('.view-detail-techstack-text');
  var $viewToolsRow = $viewImg.find('.view-detail-tools-row');
  var $viewToolsText = $viewImg.find('.view-detail-tools-text');
  var $viewPoints = $viewImg.find('.view-detail-points');
  var $viewBadges = $viewImg.find('.view-detail-badges');

  var $dePrev = $('#design>.prev');
  var $deNext = $('#design>.next');
  var $design = $('#design>.container>ul');
  var $designs = $('#design>.container>ul>li');
  var deLast = $designs.length - 1;
  var $gallOpen = $('.gallOpen');
  var $gallClose = $('.gallClose');
  var $gall = $('.gallery_bg');

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

  // 프로젝트 상세 설명이 준비된 카드는 미리보기+상세 정보를 보여주고,
  // 아직 내용이 없는 카드는 "준비중" 안내만 표시
  $viewOpen.on('click',function(event){
    event.preventDefault();
    var $card = $(this);
    var desc = $card.data('desc');
    var link = $card.data('link');
    var tags = $card.data('tags');
    var role = $card.data('role');
    var period = $card.data('period');
    var techStack = $card.data('tech-stack');
    var tools = $card.data('tools');
    var points = $card.data('points');
    var originalLink = $card.data('original-link');

    $viewTitle.text($card.data('title'));

    // 미리보기 배율 계산이 실제 렌더링된 너비를 읽어야 하므로,
    // 내용을 채우기 전에 먼저 모달을 표시한다 (display:none 상태에서는
    // .width()가 정확한 값을 반환하지 않는다).
    $view.fadeIn();
    $viewImg.scrollTop(0);

    if(desc){
      $viewDesc.text(desc).show();
      $viewNotice.hide();
    }else{
      $viewDesc.hide();
      $viewNotice.show();
    }

    if(link){
      $viewLink.attr('href', link).show();
    }else{
      $viewLink.hide();
    }

    if(originalLink){
      $viewOriginalLink.attr('href', originalLink).show();
    }else{
      $viewOriginalLink.hide();
    }

    // 미리보기 iframe은 실제로 열어볼 링크(외부/로컬 페이지)가 있을 때만 표시.
    // 항상 데스크톱 너비(1440px)로 렌더링한 뒤 미리보기 박스 너비에 맞게
    // 축소해서 보여준다 — 그대로 크기만 줄이면 사이트의 모바일 브레이크포인트가
    // 뒤섞여 레이아웃이 깨지기 때문. 박스 자체 높이는 고정(한눈에 보이는
    // 레이아웃 유지)이고, 휠로 iframe 내부를 스크롤해서 사이트의 아래쪽
    // 내용을 확인한다.
    if(link){
      var previewScale = $viewPreview.width() / 1440;
      $viewPreviewFrame.css('transform', 'scale(' + previewScale + ')');
      $viewPreviewFrame.data('scale', previewScale);
      $viewPreviewFrame.attr('src', link);
      $viewPreview.show();
    }else{
      $viewPreviewFrame.attr('src', '');
      $viewPreview.hide();
    }

    if(tags){
      $viewTags.text(tags).show();
    }else{
      $viewTags.hide();
    }

    // 각 메타 행은 dt/dd가 가로로 나란히 있어야 해서 jQuery show()가 아니라
    // display:flex로 직접 지정 (show()는 div 기본값인 block으로 되돌려버림)
    if(role){
      $viewRole.text(role);
      $viewRoleRow.css('display','flex');
    }else{
      $viewRoleRow.hide();
    }

    if(period){
      $viewPeriod.text(period);
      $viewPeriodRow.css('display','flex');
    }else{
      $viewPeriodRow.hide();
    }

    if(techStack){
      $viewTechStackText.text(techStack);
      $viewTechStackRow.css('display','flex');
    }else{
      $viewTechStackRow.hide();
    }

    if(tools){
      $viewToolsText.text(tools);
      $viewToolsRow.css('display','flex');
    }else{
      $viewToolsRow.hide();
    }

    // 하단 뱃지는 기술 스택 + 개발 도구를 합쳐서 보여준다
    var badgeSource = [];
    if(techStack){ badgeSource = badgeSource.concat(techStack.split(',')); }
    if(tools){ badgeSource = badgeSource.concat(tools.split(',')); }

    if(badgeSource.length){
      $viewBadges.empty();
      badgeSource.forEach(function(item){
        var label = item.trim();
        if(label){ $viewBadges.append($('<span class="stack-badge"></span>').text(label)); }
      });
      $viewBadges.css('display','flex');
    }else{
      $viewBadges.hide().empty();
    }

    if(points){
      $viewPoints.empty();
      points.split('|').forEach(function(item){
        var label = item.trim();
        if(label){ $viewPoints.append($('<li></li>').text(label)); }
      });
      $viewPoints.show();
    }else{
      $viewPoints.hide().empty();
    }

    $viewMeta.toggle(Boolean(role || period || techStack || tools));
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

  //모바일: 웹/그래픽 구분 없이 전체 10개를 한 장씩 넘겨보기
  var $mobileItems = $('#design .gallery>li');
  var mobileDeIdx = 0;
  var mobileDeLast = $mobileItems.length - 1;

  function isMobile(){
    return window.matchMedia('(max-width:768px)').matches;
  }

  function mobileGalleryMove(){
    $mobileItems.eq(mobileDeIdx).addClass('mobile-on').siblings().removeClass('mobile-on');
  }
  mobileGalleryMove();

  $dePrev.on('click',function(){
    if(isMobile()){
      if(mobileDeIdx>0){ mobileDeIdx--; }
      mobileGalleryMove();
      return;
    }
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
    if(isMobile()){
      if(mobileDeIdx<mobileDeLast){ mobileDeIdx++; }
      mobileGalleryMove();
      return;
    }
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
