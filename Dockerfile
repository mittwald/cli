ARG ARCH=
FROM ${ARCH}ubuntu:22.04 AS builder

COPY pkg-tarballs/mw-*-linux-*.tar.gz /tmp/
RUN mkdir /app
RUN echo $ARCH

RUN if [[ "${ARCH}" == "amd64" ]] ; then tar -C /app -xf /tmp/mw-*-linux-amd64.tar.gz ; fi
RUN if [[ "${ARCH}" == "arm64" ]] ; then tar -C /app -xf /tmp/mw-*-linux-arm.tar.gz ; fi

FROM ${ARCH}ubuntu:22.04

COPY --from=builder /app /app/

ENTRYPOINT ["/app/mw/bin/mw"]