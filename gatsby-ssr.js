const React = require('react');

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  setHeadComponents([
    <script
      key="g-adsense-script"
      data-ad-client="ca-pub-4297681002419123"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    />
  ]);
};
