FROM mcr.microsoft.com/devcontainers/base:ubuntu

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends wireguard \ 
    && apt-get -y install python3 python3-pip python3-venv

RUN pip3 install --no-cache-dir langchain langchain-openai python-dotenv

# dive to inspect docker images
RUN DIVE_VERSION=$(curl -sL "https://api.github.com/repos/wagoodman/dive/releases/latest" | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/') && \
    curl -OL https://github.com/wagoodman/dive/releases/download/v${DIVE_VERSION}/dive_${DIVE_VERSION}_linux_$(dpkg --print-architecture).deb && \
    sudo apt-get install -y ./dive_${DIVE_VERSION}_linux_$(dpkg --print-architecture).deb && \
    rm -f ./dive_${DIVE_VERSION}_linux_$(dpkg --print-architecture).deb