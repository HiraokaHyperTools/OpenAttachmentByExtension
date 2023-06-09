browser.browserAction.onClicked.addListener(
  () => (
    async () => {
      const { id, windowId } = await browser.tabs.create(
        {
          url: "/webroot/options/index.html"
        }
      );
    }
  )()
);
