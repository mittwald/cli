FROM --platform=$BUILDPLATFORM ubuntu:26.04 AS builder

ARG PKG_SOURCE="pkg-tarballs"
ARG TARGETARCH

COPY ${PKG_SOURCE}/mw-*-linux-*.tar.gz /tmp/
RUN mkdir /app

RUN case "$TARGETARCH" in \
      amd64) tar -C /app -xf /tmp/mw-*-linux-x64.tar.gz ;; \
      arm64) tar -C /app -xf /tmp/mw-*-linux-arm64.tar.gz ;; \
      *) echo "unsupported architecture: $TARGETARCH" >&2 ; exit 1 ;; \
    esac

FROM ubuntu:26.04

COPY --from=builder /app /app/

ENTRYPOINT ["/app/mw/bin/mw"]
