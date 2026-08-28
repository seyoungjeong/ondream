// Hides the website's own header/footer/nav since the app's tab bar
// already provides navigation.
export const HIDE_CHROME_JS = `
  (function () {
    document.querySelectorAll('header, footer, nav').forEach(function (el) {
      el.style.display = 'none';
    });
  })();
  true;
`;
