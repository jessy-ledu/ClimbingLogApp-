# Climbing Log PWA

Minimal offline-first app to create clean CSV rows for your climbing training dataframe.

## Run locally

```bash
cd climbing-log-pwa
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Use

1. Fill the session header.
2. Add exercise or climb rows.
3. Export CSV.
4. Analyze later in Python.

## Offline

After first load, the service worker caches the app files. Rows are stored in localStorage.
