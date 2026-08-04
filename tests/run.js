// ═══════════════════════════════════════════════════════════════════════════
//  ТЕСТЫ SPACEBRIDGE DS
//
//  Запуск из корня репозитория:
//    /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc tests/run.js
//  (в проекте нет node и нет бандлера — раннер живёт на JavaScriptCore, тот
//   идёт с macOS и не требует установки)
//
//  Что покрыто:
//    static.js  — правила из CLAUDE.md как исполняемый линтер + ссылочная
//                 целостность токенов/иконок + порядок загрузки
//    runtime.js — реальная загрузка всех файлов под DOM-заглушкой, смоук всех
//                 sbMk*-фабрик, полнота и целостность документации
//
//  Чего НЕ покрыто (и не может быть на jsc): всё, что решает layout — sticky,
//  @container, overflow, computed styles. Баги вида «пустоты в сайдбаре»
//  ловятся только глазами или браузерным прогоном.
// ═══════════════════════════════════════════════════════════════════════════

load('tests/lib/harness.js');
load('tests/lib/allowlist.js');

ROOT = './';

load('tests/static.js');
load('tests/runtime.js');

var code = runAll();
if (code !== 0) throw new Error('тесты провалены');
