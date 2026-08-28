// Hides the website's own top header/footer since the app's tab bar
// already provides navigation. Deliberately does NOT target `nav`
// directly: the site's own top-level nav is nested inside `header`
// (hidden along with it), but pages like the account dashboard have
// their own unrelated `nav` elements for in-page content (e.g. the
// dashboard's sidebar menu) that must stay visible and usable.
export const HIDE_CHROME_JS = `
  (function () {
    document.querySelectorAll('header, footer').forEach(function (el) {
      el.style.display = 'none';
    });
  })();
  true;
`;

// The account/dashboard pages (.mypage_section) use a fixed-width
// desktop sidebar layout (.mypage_header, 240px) next to a content
// column (.mypage_body) with no responsive breakpoint for narrow
// screens, so the sidebar's menu items overflow and get cut off.
// Override it to a single stacked column with the menu wrapping
// instead of overflowing. No-op (every querySelector finds nothing)
// on pages that don't have this layout.
export const FIX_MYPAGE_LAYOUT_JS = `
  (function () {
    var section = document.querySelector('.mypage_section');
    if (section) { section.style.display = 'block'; }
    var header = document.querySelector('.mypage_header');
    if (header) {
      header.style.width = '100%';
      header.style.minWidth = '0';
    }
    var nav = document.querySelector('.mypage_header nav ul');
    if (nav) {
      nav.style.display = 'flex';
      nav.style.flexWrap = 'nowrap';
      nav.style.overflowX = 'auto';
      nav.style.gap = '20px';
      nav.style.paddingBottom = '8px';
      nav.style.setProperty('-webkit-overflow-scrolling', 'touch');
    }
    document.querySelectorAll('.mypage_header nav li').forEach(function (li) {
      li.style.marginTop = '0';
      li.style.flexShrink = '0';
    });
    var body = document.querySelector('.mypage_body');
    if (body) {
      body.style.width = '100%';
      body.style.paddingLeft = '0';
    }
  })();
  true;
`;

// Suppresses window.alert() popups whose message is about login state
// (e.g. "이미 로그인 중입니다" when revisiting the login page while already
// authenticated, or "로그인이 필요합니다" when a page requires login).
// Every observed case is immediately followed by a redirect that fully
// explains what happened, so the native alert dialog is just an
// unnecessary interruption, not a loss of information. Only messages
// containing "로그인" are suppressed -- other alerts (e.g. form
// validation) still show normally. Must run via
// injectedJavaScriptBeforeContentLoaded, not the regular
// injectedJavaScript prop: the site's own alert() calls fire as soon as
// its scripts execute, before injectedJavaScript's post-load timing
// would have a chance to override window.alert.
export const SUPPRESS_LOGIN_ALERTS_JS = `
  var nativeAlert = window.alert;
  window.alert = function (message) {
    if (typeof message === 'string' && message.indexOf('로그인') !== -1) {
      return;
    }
    return nativeAlert(message);
  };
  true;
`;
