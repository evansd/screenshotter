# Screenshotter

Takes screenshots of charts from
[OpenPrescribing](https://openprescribing.net) for embedding in other
sites and online versions of papers.


## Overview

This repo contains:

 * `take-screenshot.js` which loads a particular webpage, screenshots a
   specific element, and saves the image to the `docs/` directory;

 * `commit-and-push.sh` which commits any changes in the `docs/`
   directory and pushes them back to Github (using a
   `GITHUB_PERSONAL_TOKEN` environment variable);

 * `circleci-config.yml` which runs the above two scripts as a CircleCI
   Scheduled Job (a cron job, effectively)

This results in "self-updating" screenshot images. As the images are in
the `docs/` directory they can be served directly by Github using a
standard Github Pages configuration.

This setup has a number of advantages:

 * it costs us nothing and requires none of its own infrastructure;
 * it doesn't require any additional complexity in the
   [OpenPrescribing](https://github.com/ebmdatalab/openprescribing)
   application;
 * it's robust against temporary failures, so the embedded charts stay
   up even if our application has issues.

Most importantly though, it degrades gracefully in the face of long-term
failure: eventually we'll make changes to the site which mean this
particular chart is no longer rendered, or CircleCI will remove their
scheduled jobs API, or something else will happen that stops the
screenshot updating; at that point we'll just keep serving the most
recent chart image forever*, which is far superior to leaving a broken
iframe on the embedding site.

Viewed another way, this removes the ongoing maintenance burden of
having embedded content by removing the obligation (or sense of
obligation) to keep it working in purpetuity.

("Forever" here meaning "as long as Github Pages keeps working" -- but
because we use a custom domain we can always host the static files
elsewhere if we have to.)


## Inspiration

Inspired by the ingenious Simon Willison and his [self-updating
log](https://simonwillison.net/2019/Mar/13/tree-history/) of trees in
San Fransisco.
