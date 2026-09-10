# Чек-лист: пуш и релиз

## Обычный пуш

1. `jsc tests/run.js` — пушим только зелёное.
2. Вики обновлена по затронутым страницам; после правок компонентов — `jsc tools/gen-wiki.js`.
3. Коммит на английском → `git push origin main`. Версия не трогается.

## Релиз (решение о bump'е принимает автор DS)

Semver-правила — CONTRIBUTING.md «Версионирование» (MINOR = новый компонент, PATCH = фиксы, MAJOR = ломающее).

1. Бейдж `data-version` в `index.html` — единственный источник версии (там же fallback в Info Footer-скрипте, `sed` по файлу ловит оба).
2. Запись в `CHANGELOG.md` (newest first, формат соседних записей).
3. `jsc tools/gen-pkg.js` — версия pkg/package.json подтянется из бейджа.
4. `jsc tests/run.js`.
5. Коммит `Release X.Y.Z` → `git tag vX.Y.Z` → `git push origin main --tags`.
6. Пока пакет распространяется через GitHub Releases: собрать tarball
   (`cp -R pkg package && tar -czf spacebridge-ds-styles-X.Y.Z.tgz package`),
   создать Release на теге, прикрепить tgz. Ссылку для `npm i` — команде.

Шаг 6 отпадёт после переезда на npm registry (вопрос созвона — [../plans/angular-adoption.md](../plans/angular-adoption.md)).
