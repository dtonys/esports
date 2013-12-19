$(document).ready(function(e){
  console.log('main.js loaded: document ready');
  $sidebar = $('#sidebar');
  $content_wrap = $('#content-wrap');
  $navbar = $('#navbar');
  
  $s2_btn = $('#show-sidebar-2');
  $sidebar_2 = $('#sidebar-2');
  $close_s2 = $sidebar_2.find('.close-sidebar')
  
  $sidebar.click(function(e){
    if($sidebar.hasClass('sidebar-open')){
      $sidebar.removeClass('sidebar-open').addClass('sidebar-closed');
      $content_wrap.removeClass('sidebar-open').addClass('sidebar-closed');
      $navbar.removeClass('sidebar-open').addClass('sidebar-closed');
    }
    else if($sidebar.hasClass('sidebar-closed')){
      $sidebar.removeClass('sidebar-closed').addClass('sidebar-open');
      $content_wrap.removeClass('sidebar-closed').addClass('sidebar-open');
      $navbar.removeClass('sidebar-closed').addClass('sidebar-open'); 
    }
  });
  
  //open s2
  $s2_btn.click(function(e){
    $s2_btn.addClass('hidden');
    $sidebar_2.removeClass('hidden');
    $content_wrap.addClass('sidebar-2-closed')
  });
  
  //close s2
  $close_s2.click(function(e){
    $s2_btn.removeClass('hidden');
    $sidebar_2.addClass('hidden');
    $content_wrap.removeClass('sidebar-2-open').addClass('sidebar-2-closed');
    e.stopPropagation();
  });
  
  //expand s2
  $sidebar_2.click(function(e){
    if($sidebar_2.hasClass('sidebar-open')){
      $sidebar_2.removeClass('sidebar-open').addClass('sidebar-closed');
      $content_wrap.removeClass('sidebar-2-open').addClass('sidebar-2-closed');

    }
    else if($sidebar_2.hasClass('sidebar-closed')){
     $sidebar_2.removeClass('sidebar-closed').addClass('sidebar-open');
     $content_wrap.removeClass('sidebar-2-closed').addClass('sidebar-2-open');
    }
  });
  
});