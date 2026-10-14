/* Controls for a standalone artwork frame; rendering stays in the project bundle. */
(() => {
  const page = document.querySelector('.demo-page');
  const url = page.dataset.artwork;
  const animated = page.hasAttribute('data-animated');
  const mount = document.querySelector('#demo-canvas');
  const playButton = document.querySelector('#motion');
  const regenerateButton = document.querySelector('#regenerate');
  const status = document.querySelector('#motion-status');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const icons = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 4.5a1 1 0 0 1 1.5-.86l11 6.5a1 1 0 0 1 0 1.72l-11 6.5A1 1 0 0 1 8 17.5Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>'
  };
  let frame, token, timeout;
  let paused = motionPreference.matches, loading = false, ready = false;
  let resumeAfterLoad = false;

  function updateControls() {
    mount.setAttribute('aria-busy', String(loading));
    regenerateButton.disabled = loading;
    if (!animated) return;
    playButton.disabled = loading || !ready;
    const label = paused ? 'Resume animation' : 'Pause animation';
    playButton.innerHTML = paused ? icons.play : icons.pause;
    playButton.setAttribute('aria-label', label);
    playButton.title = label;
  }

  function send(type) {
    if (animated && ready) {
      frame.contentWindow.postMessage({ channel: 'project-display', token, type }, '*');
    }
  }

  function applyMotion() {
    updateControls();
    send(paused || document.hidden ? 'pause' : 'resume');
  }

  function fail() {
    clearTimeout(timeout);
    loading = false;
    ready = false;
    status.textContent = 'The artwork could not load. Try Regenerate artwork or reload the page.';
    status.hidden = false;
    updateControls();
  }

  function loadArtwork(regenerating = false) {
    clearTimeout(timeout);
    loading = true;
    ready = false;
    resumeAfterLoad = regenerating;
    status.hidden = true;
    status.textContent = '';
    updateControls();
    token = window.crypto.randomUUID();
    const source = new URL(url, document.baseURI);
    source.hash = new URLSearchParams({ displayToken: token, paused: paused || document.hidden ? '1' : '0' });
    frame = document.createElement('iframe');
    frame.className = 'artwork-frame';
    frame.title = 'Artwork preview';
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.src = source.href;
    mount.replaceChildren(frame);
    timeout = setTimeout(fail, 15000);
  }

  window.addEventListener('message', event => {
    const message = event.data;
    if (!loading || event.source !== frame.contentWindow || message?.channel !== 'project-display' || message.token !== token) return;
    if (message.type === 'error') return fail();
    if (message.type !== 'ready') return;
    clearTimeout(timeout);
    loading = false;
    ready = true;
    if (resumeAfterLoad) paused = false;
    applyMotion();
  });

  if (animated) {
    playButton.hidden = false;
    playButton.addEventListener('click', () => { paused = !paused; applyMotion(); });
    motionPreference.addEventListener('change', event => { paused = event.matches; applyMotion(); });
    document.addEventListener('visibilitychange', applyMotion);
    window.addEventListener('pagehide', () => send('pause'));
    window.addEventListener('pageshow', applyMotion);
  }
  regenerateButton.hidden = false;
  regenerateButton.addEventListener('click', () => loadArtwork(true));
  loadArtwork();
})();
