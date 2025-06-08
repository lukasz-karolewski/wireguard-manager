FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        wireguard \
        python3 \
        python3-pip \
        python3-venv \
        sudo \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
#RUN pip3 install --no-cache-dir langchain langchain-openai python-dotenv

# Install dive to inspect docker images
RUN DIVE_VERSION=$(curl -sL "https://api.github.com/repos/wagoodman/dive/releases/latest" | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/') && \
    curl -OL https://github.com/wagoodman/dive/releases/download/v${DIVE_VERSION}/dive_${DIVE_VERSION}_linux_$(dpkg --print-architecture).deb && \
    apt-get update && \
    apt-get install -y ./dive_${DIVE_VERSION}_linux_$(dpkg --print-architecture).deb && \
    rm -f ./dive_${DIVE_VERSION}_linux_$(dpkg --print-architecture).deb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*