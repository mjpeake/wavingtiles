/* Display-only adapter. Imported artwork bundles remain unchanged. */
(function () {
  const params = new URLSearchParams(location.hash.slice(1));
  const token = params.get('displayToken');
  const nativeRequest = window.requestAnimationFrame.bind(window);
  const nativeCancel = window.cancelAnimationFrame.bind(window);
  const pending = new Map(); let nextId = 0, requestedPause = params.get('paused') === '1';
  // Paint an initial still even when playback starts paused.
  let initialFrames = 1;
  let paused = requestedPause || document.hidden;
  function send(type) { parent.postMessage({ channel: 'project-display', token, type }, '*'); }
  function schedule(entry) {
    entry.nativeId = nativeRequest(time => {
      entry.nativeId = null;
      if (paused && !entry.firstFrame) return;
      pending.delete(entry.id); entry.callback(time);
    });
  }
  window.requestAnimationFrame = callback => {
    const entry = { id: ++nextId, callback, nativeId: null, firstFrame: initialFrames-- > 0 }; pending.set(entry.id, entry);
    if (!paused || entry.firstFrame) schedule(entry); return entry.id;
  };
  window.cancelAnimationFrame = id => {
    const entry = pending.get(id);
    if (entry && entry.nativeId !== null) nativeCancel(entry.nativeId);
    pending.delete(id);
  };
  function updatePause() {
    paused = requestedPause || document.hidden;
    for (const entry of pending.values()) {
      if (paused && !entry.firstFrame && entry.nativeId !== null) { nativeCancel(entry.nativeId); entry.nativeId = null; }
      else if ((!paused || entry.firstFrame) && entry.nativeId === null) schedule(entry);
    }
  }
  window.addEventListener('message', event => {
    if (event.source !== parent || !event.data || event.data.channel !== 'project-display' || event.data.token !== token) return;
    if (event.data.type === 'pause') requestedPause = true;
    else if (event.data.type === 'resume') requestedPause = false;
    else return;
    updatePause();
  });
  document.addEventListener('visibilitychange', updatePause);
  window.addEventListener('resize', () => {
    if (!paused) return;
    // Repaint the resized canvas once while playback remains paused.
    const entry = pending.values().next().value;
    if (!entry) return;
    entry.firstFrame = true;
    if (entry.nativeId === null) schedule(entry);
  });
  window.addEventListener('error', () => send('error'));
  window.addEventListener('load', () => queueMicrotask(() => send('ready')));
})();
