window.blogcom_oauth_comments = {
    loginAs: function(providerId, providerName, realName, profileHref, logoutHref, extraFields) {
        var innerHtml;
        innerHtml = window.blogcom_oauth_comments.loggedInAsLocalizedString.
            replace('providerName', providerName).
            replace('realName', realName).
            replace('profileHref', profileHref).
            replace('logoutHref', logoutHref);
        innerHtml += "<input type=\"hidden\" name=\"oauth_provider\" value=\"the_value\">".replace("the_value", providerId);
        for (var name in extraFields) {
            innerHtml += "<input type=\"hidden\" name=\"the_name\" value=\"the_value\">".replace("the_value", extraFields[name]).replace("the_name", name);
        }
        window.jQuery('#commentform .blogcom-oauth-comments-identity').hide();
        window.jQuery('#commentform .blogcom-oauth-comments-identity input,#commentform .blogcom-oauth-comments-identity textarea,#commentform .blogcom-oauth-comments-identity select').attr('disabled', true);
        window.jQuery('#blogcom-oauth-comments-identity-' + providerId).show().html(innerHtml);
        window.jQuery('#blogcom-oauth-comments-identity-' + providerId + ' input,' + 
                '#blogcom-oauth-comments-identity-' + providerId + ' textarea,' +
                '#blogcom-oauth-comments-identity-' + providerId + ' select').attr('disabled', false);
        window.jQuery('#all-comment-providers li a.comment-provider-selected').removeClass('comment-provider-selected');
        window.jQuery('#comment-provider-link-blogcom_oauth_comments_' + providerId).addClass('comment-provider-selected');

    },
    useDefaultLogin: function() {
        window.jQuery('#commentform .blogcom-oauth-comments-identity').hide();
        window.jQuery('#commentform .blogcom-oauth-comments-identity input,#commentform .blogcom-oauth-comments-identity textarea,#commentform .blogcom-oauth-comments-identity select').attr('disabled', true);
        window.jQuery('#blogcom-oauth-comments-identity-default').show();
        window.jQuery('#blogcom-oauth-comments-identity-default input,' + 
                '#blogcom-oauth-comments-identity-default textarea,' +
                '#blogcom-oauth-comments-identity-default select').attr('disabled', false);
        window.jQuery('#all-comment-providers li a.comment-provider-selected').removeClass('comment-provider-selected');
        window.jQuery('#comment-provider-link-default').addClass('comment-provider-selected');
        window.blogcom_oauth_comments.deregisterCurrentProvider();
    },
    localStorageEnabled: function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e){
            return false;
        }
    },
    registerCurrentProvider: function(callback, href) {
        if (!window.blogcom_oauth_comments.localStorageEnabled()) return;
        window.localStorage.setItem('blogcom_oauth_comments_current_provider_callback', callback);
        window.localStorage.setItem('blogcom_oauth_comments_current_provider_href', href);
    },
    activateCurrentProvider: function() {
        return; // Disabled, at the moment
        if (!window.blogcom_oauth_comments.localStorageEnabled()) return;
        var callback = window.localStorage.getItem('blogcom_oauth_comments_current_provider_callback');
        var href = window.localStorage.getItem('blogcom_oauth_comments_current_provider_href');
        if (!callback || !href || callback === null || href === null) return;
        if (!(callback in window && window[callback] !== null)) return;
        if (!window.jQuery.isFunction(window[callback])) return;
        window[callback](href);
    },
    deregisterCurrentProvider: function() {
        if (!window.blogcom_oauth_comments.localStorageEnabled()) return;
        window.localStorage.removeItem('blogcom_oauth_comments_current_provider_callback');
        window.localStorage.removeItem('blogcom_oauth_comments_current_provider_href');
    },
    loggedInAsLocalizedString: "Logged in as <a href=\"profileHref\">realName</a> via providerName. <a href=\"#\" onclick=\"logoutHref\">Logout</a>."
}

jQuery(window.document).delegate('#comment-provider-link-default', 'click', function (ev) {
    window.blogcom_oauth_comments.useDefaultLogin();
    ev.preventDefault();
});
