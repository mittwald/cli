ARG ARCH=""
FROM ${ARCH}ubuntu:22.04 AS builder

ARG PKG_SOURCE="pkg-tarballs"

COPY ${PKG_SOURCE}/mw-*-linux-*.tar.gz /tmp/
RUN mkdir /app
RUN echo $ARCH

RUN if [ "$(uname -p)" = "aarch64" ] ; then tar -C /app -xf /tmp/mw-*-linux-arm64.tar.gz ; else tar -C /app -xf /tmp/mw-*-linux-x64.tar.gz ; fi

FROM ${ARCH}ubuntu:22.04

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-client rsync \
    && rm -rf /var/lib/apt/lists/*

# Port forwardings must bind to the container's network interface, otherwise
# they cannot be published to the host with "docker run -p".
RUN echo "GatewayPorts yes" > /etc/ssh/ssh_config.d/mw-port-forward.conf

COPY --from=builder /app /app/

ENTRYPOINT ["/app/mw/bin/mw"]