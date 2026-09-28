window.comment_provider_link_blogcom_oauth_comments_browserid_callback = function(assertion) {
    window.jQuery.ajax({
      type: 'POST',
      url: '/wp-content/mu-plugins/blogcom-oauth-comments/endpoints/browserid/',
      dataType: 'json',
      data: { assertion: assertion },
      success: function(res, status, xhr) {  
          if (res.status !== 'okay') return;
          window.jQuery('#email').attr( { value: res.email } );
          window.jQuery('#assertion').attr( { value: assertion } );
      },
      error: function(res, status, xhr) {  
      }  
    });
}
jQuery(window.document).delegate('#browserid,#email', 'click', function(ev) {
    navigator.id.get(window.comment_provider_link_blogcom_oauth_comments_browserid_callback);
});
