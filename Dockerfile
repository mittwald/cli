ARG ARCH=
FROM ${ARCH}ubuntu:22.04 AS builder

COPY pkg-tarballs/mw-*-linux-*.tar.gz /tmp/
RUN mkdir /app
RUN echo $ARCH

RUN if [ "$(uname -p)" = "aarch64" ] ; then tar -C /app -xf /tmp/mw-*-linux-arm64.tar.gz ; else tar -C /app -xf /tmp/mw-*-linux-x64.tar.gz ; fi

FROM ${ARCH}ubuntu:22.04

COPY --from=builder /app /app/

ENTRYPOINT ["/app/mw/bin/mw"]