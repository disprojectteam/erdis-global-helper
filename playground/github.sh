#!/bin/sh
for repo in erdis-gateway erdis-middleware erdis-middleware-worker ; do
    (cd "${repo}" && git checkout dev && git up)
done