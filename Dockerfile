ARG ARCH=""
FROM --platform=$BUILDPLATFORM ubuntu:26.04 AS builder

ARG PKG_SOURCE="pkg-tarballs"
ARG TARGETARCH

COPY ${PKG_SOURCE}/mw-*-linux-*.tar.gz /tmp/
RUN mkdir /app

RUN if [ "$TARGETARCH" = "arm64" ] ; then tar -C /app -xf /tmp/mw-*-linux-arm64.tar.gz ; else tar -C /app -xf /tmp/mw-*-linux-x64.tar.gz ; fi

FROM ${ARCH}ubuntu:26.04

COPY --from=builder /app /app/

ENTRYPOINT ["/app/mw/bin/mw"]
