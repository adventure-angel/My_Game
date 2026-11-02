// Runs before game resources. Never reads, clears or uploads player storage.
(function () {
  'use strict';
  var stage = '页面已打开', done = false, failed = false;
  var box = document.getElementById('bootGuard');
  var copy = document.getElementById('bootStatus');
  var detail = document.getElementById('bootDetail');
  var retry = document.getElementById('bootRetry');
  function fail(reason) {
    if (done) return;
    failed = true;
    box.hidden = false;
    copy.textContent = '启动暂未完成，请截图反馈';
    detail.textContent = 'v32 · ' + stage + '\n' + String(reason).slice(0,240) + '\n现有存档未被清除。';
    retry.hidden = false;
  }
  window.StarCandyBoot = {
    stage: function (name) { stage = name; if (!failed) copy.textContent = name + '…'; },
    finish: function () {
      requestAnimationFrame(function () {
        var screen = document.getElementById('screen');
        if (!screen || !screen.children.length) { fail('游戏首页没有生成'); return; }
        if (failed) return;
        done = true; clearTimeout(timer); box.hidden = true;
      });
    }
  };
  retry.onclick = function () { location.reload(); };
  window.addEventListener('error', function (event) {
    if (event.target && event.target.tagName === 'SCRIPT') fail('程序文件未载入：' + (event.target.id || 'runtime'));
    else if (event.message) fail(event.message + ' · 行 ' + (event.lineno || '?'));
  }, true);
  window.addEventListener('unhandledrejection', function (event) {
    fail(event.reason && event.reason.message || '启动任务未完成');
  });
  window.addEventListener('pageshow', function () {
    document.body.dataset.artHidden = String(document.hidden);
  });
  var timer = setTimeout(function () { fail('等待超过 20 秒，可重新打开；如果仍停留，请发送此画面。'); }, 20000);
})();
