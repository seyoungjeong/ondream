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
