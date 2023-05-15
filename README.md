# Brisbane Open House

https://brisbaneopenhouse.com.au/

## Installation

```bash
npm i
npm run production
```

Built assets will output to `dist/`, which is not version controlled.

Timber uses `dist/manifest.json` to locate the latest built assets, even if they include hashes.

## Deployment

`.github/workflows/main.yml` exists, but it's unknown if it works. The project can be manually deployed by copying files via SFTP.

## Wordpress

### ACF

[ACF Sync](https://www.advancedcustomfields.com/resources/synchronized-json/) saves ACF field configuration to `acf-json/`. These files should always contain the latest ACF configuration and be committed to version control.

### Google Maps

The Google Maps API key is configured under the Options screen.

## Timber

https://timber.github.io/docs/

## Twig

https://twig.symfony.com/

## WPEngine

## Google Maps

The Google Maps API key key is only used for in wp-admin to select a building location. On the frontend https://developers.google.com/maps/documentation/embed/get-started?authuser=1 is used to avoid API charges.
