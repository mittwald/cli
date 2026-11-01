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

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssh-client rsync \
    && rm -rf /var/lib/apt/lists/*

# Port forwardings must bind to the container's network interface, otherwise
# they cannot be published to the host with "docker run -p".
RUN echo "GatewayPorts yes" > /etc/ssh/ssh_config.d/mw-port-forward.conf

# Ubuntu 24.04+ ships a "ubuntu" user with UID 1000, the most common host UID.
RUN if id ubuntu > /dev/null 2>&1; then userdel --remove ubuntu; fi \
    && useradd --create-home --shell /usr/sbin/nologin mw

COPY --from=builder /app /app/
COPY docker/entrypoint.sh /usr/local/bin/mw-entrypoint

ENTRYPOINT ["/usr/local/bin/mw-entrypoint"]
